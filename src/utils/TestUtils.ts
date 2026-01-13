export class TestUtils {
    static randomString(length = 8): string {
        return Math.random().toString(36).substring(2, 2 + length);
    }

    static randomNumber(min = 1, max = 1000): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomEnum<T extends object>(anEnum: T): T[keyof T] {
        const values = Object.values(anEnum);
        return values[Math.floor(Math.random() * values.length)] as T[keyof T];
    }
}