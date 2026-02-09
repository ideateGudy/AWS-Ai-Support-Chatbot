const {DynamoDBClient, GetItemCommand} = require('@aws-sdk/client-dynamodb');
const {close, delegate} = require('../../utils/lexResponse');

const ddbClient = new DynamoDBClient({region: process.env.REGION});

// Handler for the TrackOrder intent.
exports.trackOrder = async (event) => {
    const slots = event.sessionState.intent.slots;
    const orderId = slots.OrderID?.value?.interpretedValue;
    if (!orderId) {
        return delegate(event);
    }

    const tableName = process.env.TableName;

    const params = {
        TableName: tableName,
        Key: {
            orderId: { S: orderId }
        }
    };

    try {
        const data = await ddbClient.send(new GetItemCommand(params));
        if (!data.Item) {
            return close('TrackOrder', `No order found with ID ${orderId}.`);
        }
        const order = {
            itemId: data.Item.itemId.S,
            quantity: data.Item.quantity.N,
            status: data.Item.status.S,
            createdAt: data.Item.createdAt.S
        }
        return close('TrackOrder', `The status of your order with ID ${orderId} for Quantity: ${order.quantity} of itemId ${order.itemId} is Status: ${order.status}.`);
    } catch (error) {
        return close('TrackOrder', `There was an error retrieving your order status for ${orderId}. Please try again later.`);
    }
};