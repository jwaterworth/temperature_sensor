import { TimestreamQueryClient, QueryCommand } from '@aws-sdk/client-timestream-query';
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from "aws-lambda";

const timestreamQuery = new TimestreamQueryClient({
    region: 'eu-west-1'
});

interface SensorData {
    time?: string;
    value?: string;
    room?: string;
}

const formatDate = (date: Date): string => {
    const isoString = date.toISOString();
    const [datePart, timePart] = isoString.split('T');
    const formattedDate = `${datePart} ${timePart.substr(0, 8)}`;
    return formattedDate;
}

const getSensorData = async (
    endpoint: string,
    room: string,
    startDate: Date,
    endDate: Date,
    groupBy: 'week' | 'day' | 'hour' | 'minute' | 'second' = 'minute',
): Promise<SensorData[]> => {
    const tableName = getTableName(endpoint);

    const queryString = `
    SELECT DATE_TRUNC('${groupBy}', time) AS time_interval,
    AVG(measure_value::double) AS value,
    room
    FROM "HouseData"."${tableName}"
    WHERE room = '${room}' AND time BETWEEN '${formatDate(startDate)}' AND '${formatDate(endDate)}'
    GROUP BY DATE_TRUNC('${groupBy}', time), room
    ORDER BY DATE_TRUNC('${groupBy}', time) ASC`;

    const result = await timestreamQuery.send(new QueryCommand({
        QueryString: queryString,
    }));

    return result.Rows?.map(row => ({
        time: row?.Data?.[0].ScalarValue,
        value: row?.Data?.[1].ScalarValue,
        room: row?.Data?.[2].ScalarValue,
    })) ?? [];
};

const getTableName = (endpoint: string): string => {
    switch (endpoint) {
        case 'temperature':
            return 'Temperature';
        case 'humidity':
            return 'Humidity';
        default:
            throw new Error('Invalid endpoint');
    }
}


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
    const { room, startDate, endDate, groupBy } = queryStringParameters ?? {};

    // return a bad request if room, startDate or endDate are missing
    if (!room || !startDate || !endDate) {
        return formatResponse(400, { message: "Missing query parameters" });
    }

    if (room && !['living-room', 'bedroom', 'kitchen', 'dining-room'].includes(room)) {
        return formatResponse(400, { message: "Invalid room parameter" });
    }

    if (groupBy && !['week', 'day', 'hour', 'minute', 'second'].includes(groupBy)) {
        return formatResponse(400, { message: "Invalid groupBy parameter" });
    }

    try {
        if (endpoint === "temperature" || endpoint === "humidity") {
            const data = await getSensorData(endpoint, room, new Date(startDate), new Date(endDate), groupBy as any);
            return formatResponse(200, { data });
        } else {
            return formatResponse(404, { message: "Endpoint not found" });
        }
    } catch (err) {
        console.log(err);
        return formatResponse(500, { message: `Error: ${err}` });
    }
};
