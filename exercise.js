nums => {
    const {v1, v2, t} = [...nums]
    const dist1 = v1 * t;
    const dist2 = v2 * t;

    console.log(Math.abs(dist1 - dist2));
}