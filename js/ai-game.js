class JeopardyGame {
    constructor() {
        this.currentQuestion = null;
        this.players = [
            { name: 'Player 1', score: 0 },
            { name: 'Player 2', score: 0 },
            { name: 'Player 3', score: 0 }
        ];
        this.categories = [
            {
                name: 'LLMs & Foundation Models',
                questions: [
                    { value: 200, question: 'In 2024, this company released Claude 3 models including Opus, Sonnet, and this fastest version', answer: 'What is Haiku?' },
                    { value: 400, question: 'This 2024 open source model from Mistral AI achieved GPT-4 level performance', answer: 'What is Mixtral-8x7B?' },
                    { value: 600, question: 'The key innovation of mixture-of-experts models like Mixtral is this technique that activates only some neural pathways', answer: 'What is sparse activation?' },
                    { value: 800, question: 'Beyond text, multimodal LLMs like GPT-4V and Claude 3 can now handle these types of inputs', answer: 'What are images/vision?' },
                    { value: 1000, question: 'This 2024 advancement allows LLMs to maintain longer conversations by summarizing previous context', answer: 'What is memory/context compression?' }
                ]
            },
            {
                name: 'AI Agents',
                questions: [
                    { value: 200, question: 'Released in 2024, this framework by Microsoft enables autonomous AI agents', answer: 'What is AutoGen?' },
                    { value: 400, question: 'LangGraph, CrewAI and this other framework help orchestrate multiple AI agents', answer: 'What is PhiData?' },
                    { value: 600, question: 'AI agents use this cycle of thought, action, and observation to accomplish tasks', answer: 'What is the ReAct framework?' },
                    { value: 800, question: 'This type of learning allows agents to improve through trial and error', answer: 'What is reinforcement learning?' },
                    { value: 1000, question: 'These specialized AI agents can autonomously write and debug code', answer: 'What are coding agents?' }
                ]
            },
            {
                name: 'Healthcare AI',
                questions: [
                    { value: 200, question: 'In 2024, HHS released a strategic plan focusing on this key AI principle in healthcare', answer: 'What is responsible/ethical AI use?' },
                    { value: 400, question: 'The FDA now requires AI healthcare tools to demonstrate this quality before approval', answer: 'What is safety and reliability?' },
                    { value: 600, question: 'In Jan 2024, CMS issued rules requiring health insurers to explain this about their AI systems', answer: 'What is coverage criteria and utilization management?' },
                    { value: 800, question: 'This type of AI can analyze medical images to detect diseases', answer: 'What is computer vision/medical imaging AI?' },
                    { value: 1000, question: 'The WHO\'s 2024 guidance emphasized providing this for AI development', answer: 'What is public computing infrastructure and datasets?' }
                ]
            },
            {
                name: 'AI in Education',
                questions: [
                    { value: 200, question: 'This popular LLM is widely used by students for homework help', answer: 'What is ChatGPT?' },
                    { value: 400, question: 'AI tools that can personalize learning pace and content for each student demonstrate this concept', answer: 'What is adaptive learning?' },
                    { value: 600, question: 'Schools are developing these to govern appropriate AI use in education', answer: 'What are AI policies/guidelines?' },
                    { value: 800, question: 'This AI application helps teachers with grading and feedback', answer: 'What is automated assessment?' },
                    { value: 1000, question: 'AI tutors use this technique to break down complex topics into simpler steps', answer: 'What is scaffolding?' }
                ]
            },
            {
                name: 'AI Regulation',
                questions: [
                    { value: 200, question: 'This executive order in late 2023 set US AI safety standards', answer: 'What is Biden\'s AI Executive Order?' },
                    { value: 400, question: 'The EU\'s comprehensive AI law passed in 2024 is called this', answer: 'What is the AI Act?' },
                    { value: 600, question: 'This US agency announced it would regulate AI in financial services', answer: 'What is the SEC?' },
                    { value: 800, question: 'Companies must now document this about training data and model behavior', answer: 'What are AI impact assessments?' },
                    { value: 1000, question: 'The NIST AI Risk Management Framework focuses on making AI systems this', answer: 'What is trustworthy?' }
                ]
            },
            {
                name: 'AI Development',
                questions: [
                    { value: 200, question: 'This technique helps AI models understand relationships between words', answer: 'What is attention/transformers?' },
                    { value: 400, question: 'RAG allows AI models to access this type of external information', answer: 'What is retrieval/knowledge bases?' },
                    { value: 600, question: 'This 2024 advancement helps AI avoid hallucination by citing sources', answer: 'What is grounding?' },
                    { value: 800, question: 'Constitutional AI uses this to align AI behavior with human values', answer: 'What is reinforcement learning from human feedback (RLHF)?' },
                    { value: 1000, question: 'This technique allows smaller AI models to match larger ones\' performance', answer: 'What is knowledge distillation?' }
                ]
            }
        ];
        this.initializeGame();
    }

    // Rest of the game logic stays the same
