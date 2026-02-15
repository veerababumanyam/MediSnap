#!/bin/bash

# MediaSnap Service Manager
# Usage: ./manage_services.sh [start|stop|restart|status]

PID_FILE=".medisnap_pids"
LOG_DIR="logs"

mkdir -p "$LOG_DIR"

function start_services {
    echo "Starting MediaSnap Services..."

    # Load .env if present
    if [ -f ".env" ]; then
        echo "Loading .env file..."
        export $(grep -v '^#' .env | xargs)
    fi

    # Check for GOOGLE_API_KEY
    if [ -z "$GOOGLE_API_KEY" ]; then
        echo "❌ Error: GOOGLE_API_KEY is not set. Please set it in .env or your shell."
        exit 1
    fi

    # 1. Start Backend (ADK Agent)
    echo "Starting Backend (ADK Agent)..."
    cd medisnap
    # Using nohup to keep it running, directing output to logs
    nohup uv run uvicorn app.fast_api_app:app --host 0.0.0.0 --port 8000 --reload > ../"$LOG_DIR"/backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    echo "Backend started with PID $BACKEND_PID"

    # 2. Start Frontend (Vite)
    echo "Starting Frontend (Vite)..."
    nohup npm run dev > "$LOG_DIR"/frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "Frontend started with PID $FRONTEND_PID"

    # Save PIDs
    echo "$BACKEND_PID:$FRONTEND_PID" > "$PID_FILE"
    
    echo "Services started! Logs available in $LOG_DIR/"
    echo "Backend: http://localhost:8000"
    echo "Frontend: Check $LOG_DIR/frontend.log for port (usually 5173)"
}

function stop_services {
    if [ -f "$PID_FILE" ]; then
        PIDS=$(cat "$PID_FILE")
        BACKEND_PID=$(echo "$PIDS" | cut -d':' -f1)
        FRONTEND_PID=$(echo "$PIDS" | cut -d':' -f2)

        echo "Stopping Services..."
        
        # Check and kill Backend
        if ps -p "$BACKEND_PID" > /dev/null; then
            kill "$BACKEND_PID"
            echo "Stopped Backend ($BACKEND_PID)"
        else
            echo "Backend ($BACKEND_PID) was not running."
        fi

        # Check and kill Frontend
        # Vite spawns children, so just killing the parent might leave orphans, but unrelated to PID file.
        # Ideally use pkill -P for children but simple kill is standard for now.
        if ps -p "$FRONTEND_PID" > /dev/null; then
            kill "$FRONTEND_PID"
            echo "Stopped Frontend ($FRONTEND_PID)"
        else
            echo "Frontend ($FRONTEND_PID) was not running."
        fi

        rm "$PID_FILE"
        echo "Services stopped."
    else
        echo "No PID file found. Are services running?"
    fi
}

function check_status {
    if [ -f "$PID_FILE" ]; then
        PIDS=$(cat "$PID_FILE")
        BACKEND_PID=$(echo "$PIDS" | cut -d':' -f1)
        FRONTEND_PID=$(echo "$PIDS" | cut -d':' -f2)

        echo "Status:"
        if ps -p "$BACKEND_PID" > /dev/null; then
            echo "✅ Backend is running (PID $BACKEND_PID)"
        else
            echo "❌ Backend is NOT running (PID $BACKEND_PID)"
        fi

        if ps -p "$FRONTEND_PID" > /dev/null; then
            echo "✅ Frontend is running (PID $FRONTEND_PID)"
        else
            echo "❌ Frontend is NOT running (PID $FRONTEND_PID)"
        fi
    else
        echo "No services appear to be managed by this script (no PID file)."
    fi
}

case "$1" in
    start)
        if [ -f "$PID_FILE" ]; then
            echo "Services allow appear to be running. Run 'status' or 'restart'."
        else
            start_services
        fi
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        sleep 2
        start_services
        ;;
    status)
        check_status
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
