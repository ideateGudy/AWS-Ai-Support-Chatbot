exports.delegate = (event) => {
    // sessionState represents the current state of conversation between the user and the bot. It can be used to pass information between different intents and dialog actions. For example, you can use sessionState to store user preferences, previous responses, or any other relevant data that you want to maintain throughout the conversation.
    return {
        sessionState: {
            // dialogAction represents the next action that the bot should take in the conversation. In this case, we are using 'Delegate' which will continue asking the user for more information until all required SLOTS are filled or the intent is fulfilled. This allows the bot to handle the conversation flow and gather necessary information from the user before taking any specific action.
            dialogAction: {
                type: 'Delegate'
            },

            intent: {
                ...event.sessionState.intent, // Copy the existing intent from the event to maintain the current state of the conversation.
                state: 'InProgress' // Set the state of the intent to 'InProgress' to indicate that the conversation is still ongoing and the bot is waiting for more information from the user.
            },

        },
    };
};

// Helper to tell lex that the intent is fulfilled and the conversation can end.

exports.close = (intentName, message) => {
    return {
        sessionState: {
            dialogAction: {
                type: 'Close'
            },
            intent: {
                name: intentName, // Use the intentName parameter to specify the intent that is being closed.
                state: 'Fulfilled' // Set the state of the intent to 'Fulfilled' to indicate that the conversation has been successfully completed and the bot can end the interaction with the user.
            },
        },
        messages: [
            {
                contentType: 'PlainText', // Specify that the message content is plain text.
                content: message // The actual message to be sent to the user, which is passed as a parameter to the function.
            }
        ]
    };
};