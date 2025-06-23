'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface BackgroundBeamsProps {
    beamCount?: number
    className?: string
}

interface Beam {
    id: number
    left: string
    height: string
    animationDuration: string
    animationDelay: string
    rotation: string
}

export function BackgroundBeams({
    beamCount = 20,
    className = ""
}: BackgroundBeamsProps) {
    const [beams, setBeams] = useState<Beam[]>([])

    useEffect(() => {
        const generateBeams = () => {
            const newBeams: Beam[] = []

            for (let i = 0; i < beamCount; i++) {
                newBeams.push({
                    id: i,
                    left: `${Math.random() * 100}%`,
                    height: `${Math.random() * 400 + 100}px`,
                    animationDuration: `${Math.random() * 3 + 2}s`,
                    animationDelay: `${Math.random() * 2}s`,
                    rotation: `${Math.random() * 360}deg`
                })
            }

            setBeams(newBeams)
        }

        generateBeams()
    }, [beamCount])

    return (
        <div className={`background-beams ${className}`}>
            {beams.map((beam) => (
                <motion.div
                    key={beam.id}
                    className="beam"
                    style={{
                        left: beam.left,
                        height: beam.height,
                        transform: `rotate(${beam.rotation})`,
                        background: 'linear-gradient(to bottom, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.1), transparent)',
                        width: '2px',
                    }}
                    animate={{
                        opacity: [0.2, 0.8, 0.2],
                        transform: [
                            `translateY(0px) rotate(${beam.rotation})`,
                            `translateY(-20px) rotate(${parseFloat(beam.rotation) + 5}deg)`,
                            `translateY(0px) rotate(${beam.rotation})`
                        ]
                    }}
                    transition={{
                        duration: parseFloat(beam.animationDuration),
                        delay: parseFloat(beam.animationDelay),
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    )
}