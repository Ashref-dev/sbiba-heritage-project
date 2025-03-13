"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Map, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExploreCtaSection() {
    return (
        <section className="relative w-full overflow-hidden py-20 md:py-32">
            {/* Central glow effect */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <motion.div
                    className="absolute size-[200px] rounded-full bg-gradient-to-r from-gradient-1 to-gradient-2 opacity-20 blur-[120px]"
                    animate={{
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse",
                    }}
                />
            </div>

            <div className="container relative z-10 px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-10 text-center">
                    {/* Floating icons */}
                    <div className="relative mx-auto w-full max-w-3xl">
                        <motion.div
                            className="absolute -left-10 -top-10 md:left-0"
                            style={{ color: 'var(--gradient-1)' }}
                            animate={{
                                y: [0, -10, 0],
                                rotate: [0, 5, 0],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        >
                            <Compass className="size-8 md:size-12" />
                        </motion.div>
                        <motion.div
                            className="absolute -bottom-8 -right-8 md:right-0"
                            style={{ color: 'var(--gradient-2)' }}
                            animate={{
                                y: [0, 10, 0],
                                rotate: [0, -5, 0],
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                        >
                            <Landmark className="size-8 md:size-12" />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            viewport={{ once: true }}
                            className="max-w-3xl space-y-6 py-6 backdrop-blur-sm"
                        >
                            <h2 className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-3xl font-bold tracking-tighter text-transparent sm:text-4xl md:text-5xl lg:text-6xl">
                                Discover Sbiba&apos;s Ancient Treasures
                            </h2>
                            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                                Explore the rich heritage of Sbiba through its historical monuments, archaeological sites, and cultural landmarks.
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute inset-0  rounded-full blur-xl"
                            style={{
                                background: 'linear-gradient(to right, var(--gradient-1), var(--gradient-2))',
                                opacity: 0.2
                            }}
                        ></div>
                        <Link href="/sites">
                            <Button
                                size="lg"
                                className="group relative overflow-hidden px-8 py-6 text-lg font-medium"
                            >
                                <span className="relative z-10 flex items-center">
                                    <Map className="mr-2 size-5" />
                                    Explore Historical Sites
                                    <ArrowRight className="ml-2 size-5 transition-transform duration-300 group-hover:translate-x-1" />
                                </span>
                                <motion.span
                                    className="absolute inset-0"
                                    style={{
                                        background: 'linear-gradient(to right, var(--gradient-1), var(--gradient-2))'
                                    }}
                                    initial={{ x: "100%", opacity: 0.5 }}
                                    whileHover={{ x: "0%", opacity: 1 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
} 