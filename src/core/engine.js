/*
 * BoseAI Local Engine
 * Lightweight browser-safe version
 */

export class BoseAIEngine {

    constructor() {
        this.ready = true;
        this.modelLoaded = false;
    }

    async initialize() {
        this.ready = true;

        return {
            ready: true,
            modelLoaded: false
        };
    }

    async generate(prompt) {

        if (!prompt || !prompt.trim()) {
            return "Please enter a message.";
        }

        const text = prompt.toLowerCase().trim();

        if (text.includes("hello") || text.includes("hi")) {
            return "Hello! I'm BoseAI. 👋";
        }

        if (text.includes("your name")) {
            return "My name is BoseAI.";
        }

        if (text.includes("how are you")) {
            return "I'm running locally in your browser. 🤖";
        }

        if (text.includes("joke")) {
            return "Why did the computer go to the doctor? Because it had a virus! 😄";
        }

        if (text.includes("who are you")) {
            return "I'm BoseAI, your local browser AI assistant.";
        }

        return `You said: "${prompt}"\n\nBoseAI is running locally, but the real language model has not been connected yet.`;
    }
}
