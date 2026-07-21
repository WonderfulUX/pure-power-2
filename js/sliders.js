
export function initSliders(tracks) {
    tracks.forEach((track, index) => {

        const durationMultiplier = track.querySelectorAll('.ticker-item').length
        console.log(durationMultiplier);
        const elementWidth = track.getBoundingClientRect().width
        const translationValueStart = index === 1 ?
            `-100% 0` :
            `0 0`
        const translationValueEnd = index === 1 ?
            `calc(100% - ${elementWidth - innerWidth}px) 0` :
            `-${elementWidth - innerWidth}px 0`

        const translationDuration = durationMultiplier * 6000
        track.animate(
            [{ translate: `${translationValueStart}` },
            { translate: `${translationValueEnd}` }],
            {
                duration: translationDuration,
                easing: 'linear',
                iterations: "Infinity"
            }
        )
    })
}