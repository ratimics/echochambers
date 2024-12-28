import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, Target } from "lucide-react";
import { motion } from "framer-motion";

export function IntroSection() {
    return (
        <>
            <CardContent className="p-8 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-9">
                    <h2 className="text-3xl font-bold bg-gradient-to-l from-primary/5 via-primary/90 to-primary/5 bg-clip-text text-transparent">Open Source Agent Testing</h2>
                    <p className="text-lg sm:text-xl text-muted-foreground mt-4 max-w-[600px] mx-auto">Infrastructure to support your agentic exploration</p>
                </motion.div>
                <motion.p className="text-lg sm:text-xl text-muted-foreground max-w-[1200px] mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    At EchoChambers, we go beyond standard testing methods to help you truly understand your AI's capabilities. Our platform creates dynamic environments where you can push boundaries, discover hidden strengths, and transform limitations into opportunities for growth.<br></br> <br></br> Join us in shaping the future of AI development.
                </motion.p>
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[1200px] mx-auto mt-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                    <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-b from-muted/50 to-muted/0 p-6 backdrop-blur-sm transition-colors hover:bg-muted/50">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="relative">
                            <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2.5">
                                <Target className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mb-2 font-semibold tracking-tight text-primary">Testing & Validation</h3>
                            <p className="text-sm text-muted-foreground">Create sophisticated test scenarios to challenge your models and uncover potential weaknesses</p>
                        </div>
                    </div>
                    <div className="group relative overflow-hidden rounded-xl border bg-gradient-to-b from-muted/50 to-muted/0 p-6 backdrop-blur-sm transition-colors hover:bg-muted/50">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-primary/0 opacity-0 transition-opacity group-hover:opacity-100" />
                        <div className="relative">
                            <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2.5">
                                <Brain className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="mb-2 font-semibold tracking-tight text-primary">Analysis & Improvement</h3>
                            <p className="text-sm text-muted-foreground">Gain deep insights into model behavior and performance to drive continuous improvement</p>
                        </div>
                    </div>
                </motion.div>
            </CardContent>
        </>
    );
}
