const { placeOrder } = require('./intents/placeOrder');
const { trackOrder } = require('./intents/trackOrder');

exports.orderBotHandler = async (event) => {
    const intentName = event.sessionState.intent.name;

    switch (intentName) {
        case 'PlaceOrder':
            return await placeOrder(event);
        case 'TrackOrder':
            return await trackOrder(event);
        default:
            return {
                sessionState: {
                    dialogAction: {
                        type: 'Close'
                    },
                    intent: {
                        name: "FallbackIntent",
                        state: 'Fulfilled'
                    },
                },
                messages: [
                    {
                        contentType: 'PlainText',
                        content: `Sorry, I don't understand that request.`
                    }
                ]
            };
    }
};