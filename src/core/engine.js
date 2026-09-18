/*
 * BoseAI Local Engine
 * -------------------
 * Real AI inference inside the browser.
 *
 * First launch:
 * - Internet is needed to download the AI model.
 *
 * After the model is cached:
 * - BoseAI can run locally without an internet connection.
 */

import {
    pipeline,
    env
} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.2";


// Use the browser's cache for downloaded model files.
env.useBrowserCache = true;

// We are using a remote model the first time.
env.allowLocalModels = false;


// Small model suitable for browser experiments.
const MODEL = "Xenova/distilgpt2";


export class BoseAIEngine {

    constructor() {

        this.generator = null;

        this.ready = false;

        this.loading = false;

    }


    async initialize() {

        // Already loaded
        if (this.ready && this.generator) {
            return {
                ready: true,
                modelLoaded: true
            };
        }


        // Prevent two downloads at the same time
        if (this.loading) {

            while (this.loading) {

                await new Promise(resolve => {
                    setTimeout(resolve, 200);
                });

            }

            return {
                ready: this.ready,
                modelLoaded: !!this.generator
            };
        }


        this.loading = true;


        try {

            console.log("BoseAI: loading local AI model...");


            this.generator = await pipeline(
                "text-generation",
                MODEL
            );


            this.ready = true;


            console.log("BoseAI: local AI model ready.");


            return {
                ready: true,
                modelLoaded: true
            };

        }

        catch (error) {

            console.error(
                "BoseAI model loading failed:",
                error
            );

            this.ready = false;

            this.generator = null;

            throw error;

        }

        finally {

            this.loading = false;

        }

    }


    async generate(prompt) {

        if (!prompt || !prompt.trim()) {

            return "Please enter a message.";

        }


        const text = prompt.trim();


        // Load the AI model if necessary.
        await this.initialize();


        if (!this.generator) {

            return "BoseAI could not load the local AI model.";

        }


        try {

            console.log(
                "BoseAI is thinking locally..."
            );


            const result = await this.generator(
                text,
                {
                    max_new_tokens: 80,
                    temperature: 0.7,
                    do_sample: true,
                    top_k: 50,
                    top_p: 0.95
                }
            );


            if (
                !result ||
                !Array.isArray(result) ||
                !result[0]
            ) {

                return "I couldn't generate a response.";

            }


            let response =
                result[0].generated_text || "";


            // Remove the original prompt if the model
            // included it in the generated text.
            if (
                response
                    .toLowerCase()
                    .startsWith(text.toLowerCase())
            ) {

                response = response.slice(
                    text.length
                );

            }


            response = response.trim();


            if (!response) {

                return "I couldn't generate a response.";

            }


            return response;


        }

        catch (error) {

            console.error(
                "BoseAI generation error:",
                error
            );


            return (
                "BoseAI had a problem generating " +
                "the response locally."
            );

        }

    }

}
