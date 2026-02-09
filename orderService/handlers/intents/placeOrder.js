const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { delegate, close } = require('../../utils/lexResponse');
const { randomUUID } = require('crypto');

const ddbClient = new DynamoDBClient({ region: process.env.REGION });

// Handler for the PlaceOrder intent.

exports.placeOrder = async (event) => {
    const slots = event.sessionState.intent.slots;
    const itemId = slots.ItemID?.value?.interpretedValue;
    const quantity = slots.Quantity?.value?.interpretedValue;

    // If either slot is missing, delegate back to Lex to ask the user for the missing information.
    if (!itemId || !quantity) {
        return delegate(event);
    }

    const orderId = randomUUID(); // Generate a unique order ID
    const tableName = process.env.TableName;

    // Save the order to DynamoDB
    const params = {
        TableName: tableName,
        Item: {
            orderId: { S: orderId },
            itemId: { S: itemId },
            quantity: { N: quantity.toString() },
            status: { S: 'Processing' },
            createdAt: { S: new Date().toISOString() }
        }
    };
    try {
        await ddbClient.send(new PutItemCommand(params));
        return close('PlaceOrder', `Your order for ${quantity} of item ${itemId} has been placed successfully with order ID ${orderId}.`);
    } catch (error) {
        return close('PlaceOrder', 'There was an error placing your order. Please try again later.');
    }
};