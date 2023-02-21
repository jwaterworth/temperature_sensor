
export interface TimeSeriesData {
    time: string;
    value: number;
}

export interface Room {
    name: string;
    title: string;
}

export interface RoomData {
    name: string;
    temperatures: TimeSeriesData[];
    humidity: TimeSeriesData[];
}


// function to create temperature data between lower and upper bound parameters
const createRoomData = (count = 30, lowerBound = 20, upperBound = 30): TimeSeriesData[] => {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            time: new Date().toISOString(),
            value: Math.floor(Math.random() * (upperBound - lowerBound + 1)) + lowerBound,
        });
    }
    return data;
};

export const getRooms = async (): Promise<Room[]> => {
    return await asyncSetTimeout(() => [
        {
            name: "living-room",
            title: "Living Room",
        },
        {
            name: "bedroom",
            title: "Bedroom",
        },
        {
            name: "kitchen",
            title: "Kitchen",
        },
        {
            name: "bathroom",
            title: "Bathroom",
        },
    ], 300);
};

const asyncSetTimeout = <T>(callback: () => T, delay: number) => {
    return new Promise<T>((resolve) => {
        setTimeout(() => {
            resolve(callback());
        }, delay);
    });
};

export const getTemperatures = async (room: string, startTime: string, endTime: string): Promise<RoomData> => {
    switch (room) {
        case "living-room":
            return await asyncSetTimeout(() => {
                console.log('loaded living room data')
                return {
                    name: "living-room",
                    temperatures: createRoomData(30, -5, 15),
                    humidity: createRoomData(30, 40, 75),
                }
            }, 750);
        case "bedroom":
            return await asyncSetTimeout(() => {
                console.log('loaded bedroom data')
                return {
                    name: "bedroom",
                    temperatures: createRoomData(30, -5, 15),
                    humidity: createRoomData(30, 40, 75),
                }
            }, 1500);
        case "kitchen":
            return await asyncSetTimeout(() => {
                console.log('loaded kitchen data')
                return {
                    name: "kitchen",
                    temperatures: createRoomData(30, -5, 15),
                    humidity: createRoomData(30, 40, 75),
                }
            }, 100);
        default:
        case "bathroom":
            return await asyncSetTimeout(() => {
                console.log('loaded bathroom data')
                return {
                    name: "bathroom",
                    temperatures: createRoomData(30, -5, 15),
                    humidity: createRoomData(30, 40, 75),
                }
            }, 500);
    }
}
