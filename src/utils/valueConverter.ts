export function formatNumber(num: number): string {
    const abs = Math.abs(num);

    if (abs >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1).replace(".0", "") + "B";
    }

    if (abs >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(".0", "") + "M";
    }

    if (abs >= 1_000) {
        return (num / 1_000).toFixed(1).replace(".0", "") + "K";
    }

    return num.toString();
}