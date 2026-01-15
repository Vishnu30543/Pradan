import { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';
import { Fab, Tooltip, CircularProgress, Badge } from '@mui/material';
import { Mic as MicIcon, Stop as StopIcon } from '@mui/icons-material';

// Vapi Public Key - Loaded from environment variables
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const VAPI_ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID;

// Ensure keys are present before initializing
const vapi = VAPI_PUBLIC_KEY ? new Vapi(VAPI_PUBLIC_KEY) : null;

const VoiceAssistant = () => {
    const [connecting, setConnecting] = useState(false);
    const [connected, setConnected] = useState(false);
    const [speaking, setSpeaking] = useState(false);

    useEffect(() => {
        if (!vapi) {
            console.error('Vapi instance not initialized. Check VITE_VAPI_PUBLIC_KEY.');
            return;
        }

        vapi.on('call-start', () => {
            setConnecting(false);
            setConnected(true);
        });

        vapi.on('call-end', () => {
            setConnecting(false);
            setConnected(false);
            setSpeaking(false);
        });

        vapi.on('speech-start', () => {
            setSpeaking(true);
        });

        vapi.on('speech-end', () => {
            setSpeaking(false);
        });

        vapi.on('error', (error) => {
            console.error('Vapi Error:', error);
            // Log inner details if available
            if (error.error) {
                console.error('Vapi Inner Error:', JSON.stringify(error.error, null, 2));
            }
            setConnecting(false);
            setConnected(false);
        });

        return () => {
            // vapi.stop(); // Cleanup on unmount if needed, but we typically want it persistent
        };
    }, []);

    const toggleCall = async () => {
        if (!vapi) {
            alert("Voice Assistant is not configured. Missing API Keys.");
            return;
        }

        if (connected) {
            vapi.stop();
        } else {
            setConnecting(true);
            try {
                await vapi.start(VAPI_ASSISTANT_ID);
            } catch (err) {
                console.error('Failed to start Vapi call:', err);
                setConnecting(false);
            }
        }
    };

    return (
        <Tooltip title={connected ? "Stop Assistant" : "Talk to Pradan Sahayak"}>
            <Fab
                color={connected ? "error" : "primary"}
                onClick={toggleCall}
                disabled={connecting}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 9999, // Ensure it's above other elements
                    boxShadow: speaking ? '0 0 20px rgba(76, 175, 80, 0.8)' : undefined,
                    transition: 'all 0.3s ease',
                    transform: speaking ? 'scale(1.1)' : 'scale(1)',
                }}
            >
                {connecting ? (
                    <CircularProgress color="inherit" size={24} />
                ) : connected ? (
                    <Badge
                        color="success"
                        variant="dot"
                        invisible={!speaking}
                        sx={{ '& .MuiBadge-badge': { backgroundColor: '#4caf50', animation: 'pulse 1.5s infinite' } }}
                    >
                        <StopIcon />
                    </Badge>
                ) : (
                    <MicIcon />
                )}
            </Fab>
        </Tooltip>
    );
};

export default VoiceAssistant;
