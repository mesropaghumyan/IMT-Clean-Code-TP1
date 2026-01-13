import { TestUtils } from "../../../src/utils/TestUtils";

describe('TestUtils Utility', () => {

    afterEach(() => {
        jest.spyOn(Math, 'random').mockRestore();
    });

    describe('randomString', () => {
        it('should generate a string of the requested length', () => {
            const length = 10;
            const result = TestUtils.randomString(length);
            expect(result.length).toBe(length);
            expect(typeof result).toBe('string');
        });
    });

    describe('randomEnum', () => {
        enum Colors {
            Red = "RED",
            Blue = "BLUE",
            Green = "GREEN"
        }

        it('should return the first element of the enum when random is 0', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0);
            const result = TestUtils.randomEnum(Colors);
            expect(result).toBe(Colors.Red);
        });

        it('should return the last element of the enum when random is 0.999', () => {
            jest.spyOn(Math, 'random').mockReturnValue(0.999);
            const result = TestUtils.randomEnum(Colors);
            expect(result).toBe(Colors.Green);
        });
    });
});