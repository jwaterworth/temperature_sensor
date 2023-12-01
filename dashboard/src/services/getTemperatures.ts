
export interface TimeSeriesData {
    time: string;
    value: number;
}

export interface CombinedSeriesData {
    time: string;
    temperature: number;
    humidity: number;
}

export interface Room {
    name: string;
    title: string;
}

export interface RoomData {
    name: string;
    combinedData: CombinedSeriesData[];
}

export const getRooms = async (): Promise<Room[]> => {
    return await asyncSetTimeout(() => [
        // {
        //     name: "living-room",
        //     title: "Living Room",
        // },
        {
            name: "bedroom",
            title: "Bedroom",
        },
        {
            name: "kitchen",
            title: "Kitchen",
        },
        {
            name: "dining-room",
            title: "Dining room",
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

export const getCombinedRoomData = async (room: string, startTime: string, endTime: string): Promise<RoomData> => {
    // call get room data for temperature and humidity and merge into RoomData object
    const [temperatures, humidity] = await Promise.all([
        requestRoomData(room, startTime, endTime, 'temperature', 'day'),
        requestRoomData(room, startTime, endTime, 'humidity', 'day')
    ])

    // group temperature and humidity by their time property
    const grouped = temperatures.reduce((acc, item) => {
        acc[item.time] = {
            ...acc[item.time],
            time: item.time,
            temperature: item.value
        }
        return acc;
    }, {} as Record<string, CombinedSeriesData>)
    humidity.forEach(item => {
        grouped[item.time] = {
            ...grouped[item.time],
            time: item.time,
            humidity: item.value
        }
    })

    return {
        name: room,
        combinedData: Object.values(grouped)
    }
};

const API_URL = 'https://home-data-api.jameswaterworth.dev'

export const requestRoomData = async (room: string, startDate: string, endDate: string, type: 'temperature' | 'humidity', groupBy = 'hour'): Promise<TimeSeriesData[]> => {
    const response = (await fetch(`${API_URL}/${type}?room=${room}&startDate=${startDate}&endDate=${endDate}&groupBy=${groupBy}`)).json()
    // map response and change time to HH:MM:SS format
    return (await response).data.map((item: any) => ({
        time: new Date(item.time).toISOString().split('T')[0],
        value: item.value
    }))

}

// calcuate todays date function in YYYY-MM-DD format
export const getToday = (): string => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
}

// yesterday
export const getYesterday = (): string => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;
}

// calcualate tomorrow's date function in YYYY-MM-DD format
export const getTomorrow = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return `${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()}`;
}

// date to string
export const dateToString = (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}
