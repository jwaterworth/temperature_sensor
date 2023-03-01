import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import { QueryRequest } from 'aws-sdk/clients/timestreamquery';
console.log('hello')
console.log('hello2')
const timestreamQuery = new AWS.TimestreamQuery({ region: 'eu-west-1' });
interface SensorData {
    time?: string;
    value?: string;
    room?: string;
}

const getSensorData = async (tableName: string, room: string, startDate: Date, endDate: Date): Promise<SensorData[]> => {
    const queryString = `
    SELECT time, measure_value::double as value, room
    FROM ${tableName}
    WHERE room = '${room}' AND time BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'
    ORDER BY time ASC`;
    const queryInput: QueryRequest = { QueryString: queryString };
    const result = await timestreamQuery.query(queryInput).promise();
    return result.Rows?.map(row => ({
        time: row.Data[0].ScalarValue,
        value: row.Data[1].ScalarValue,
        room: row.Data[2].ScalarValue
    })) ?? [];
};

const formatResponse = (statusCode: number, body: Record<string, unknown>): APIGatewayProxyResult => {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    };
};

export const lambdaHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
    const { rawPath: path, queryStringParameters } = event;
    const [endpoint] = path.split("/").filter(x => x !== "");
    const { room, startDate, endDate } = queryStringParameters ?? {};

    // return a bad request if room, startDate or endDate are missing
    if (!room || !startDate || !endDate) {
        return formatResponse(400, { message: "Missing query parameters" });
    }

    try {
        if (endpoint === "temperature" || endpoint === "humidity") {
            const data = await getSensorData(endpoint, room, new Date(startDate), new Date(endDate));
            return formatResponse(200, { data });
        } else {
            return formatResponse(404, { message: "Endpoint not found" });
        }
    } catch (err) {
        console.log(err);
        return formatResponse(500, { message: "Some error happened" });
    }
};
