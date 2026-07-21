
export function initSliders(tracks) {
    tracks.forEach((track, index) => {
        if (track.hasAttribute('data-duplicate') && !track.dataset.duplicated) {
            Array.from(track.children).forEach(child => track.appendChild(child.cloneNode(true)))
            track.dataset.duplicated = 'true'
        }

        track.getAnimations().forEach(anim => anim.cancel())

        const durationMultiplier = track.childElementCount
        const halfWidth = track.getBoundingClientRect().width / 2
        const reverse = index === 1

        const translationValueStart = reverse ? `-${halfWidth}px 0` : `0 0`
        const translationValueEnd = reverse ? `0 0` : `-${halfWidth}px 0`

        const translationDuration = durationMultiplier * 4000

        track.animate(
            [{ translate: translationValueStart },
            { translate: translationValueEnd }],
            {
                duration: translationDuration,
                easing: 'linear',
                iterations: "Infinity"
            }
        )
    })
}