type Order<T extends string> = { readonly [key in T]: number }

export function orderByIndex<T extends string>(arr: readonly T[]) {
    return Object.freeze(Object.fromEntries(arr.map((s, index: number) => [s, index]))) as unknown as Order<T>;
}

// Fisher–Yates shuffle algorithm
export function shuffle(a: any[]) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function* rangeGen(n: number) {
    for (let i = 0; i < n; i++) {
        yield i;
    }
}

export function range(n: number): Array<number> {
    return [...rangeGen(n)]
}
