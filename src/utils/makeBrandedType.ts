type Branded<T, Brand extends string> = T & { __brand: Brand };

const createEnumsNumberValue = <const T extends Record<string, number>>(obj: T, brand : string) => {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
            k, v as Branded<typeof v, typeof brand>,
        ]),
    ) as {
        [K in keyof T]: Branded<T[K], typeof brand>;
    };
}

const createEnumsStringValue = <const T extends Record<string, number>>(obj: T, brand : string) => {
    return Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
            k, v as Branded<typeof v, typeof brand>,
        ]),
    ) as {
        [K in keyof T]: Branded<T[K], typeof brand>;
    };
}

const funcs = {
    createEnumsNumberValue,
    createEnumsStringValue
}

export default funcs
