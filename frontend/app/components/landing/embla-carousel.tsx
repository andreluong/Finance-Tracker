import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from './embla-carousel-arrow-buttons'
import useEmblaCarousel from 'embla-carousel-react'

type SlideType = {
    title: string
    description: string
    content: React.ReactNode
}

type PropType = {
    slides: SlideType[]
    options?: EmblaOptionsType
}

const EmblaCarousel: React.FC<PropType> = (props) => {
    const { slides, options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    return (
        <section className="embla">
            <div className="embla__viewport bg-zinc-50 p-4 rounded-xl" ref={emblaRef}>
                <div className="embla__container">
                {slides.map((slide, index) => (
                    <div className="embla__slide" key={index}>
                        <div className='flex flex-row justify-between mr-2'>
                            <div className='flex flex-col my-auto'>
                                <p className='font-bold text-xl mb-4'>{slide.title}</p>
                                <p className='text-lg'>{slide.description}</p>
                            </div>
                            {slide.content}
                        </div>
                    </div>
                ))}
                </div>
            </div>
            <div className="embla__controls">
                <div className="embla__buttons border rounded-lg bg-zinc-50">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            </div>
        </section>
    )
}

export default EmblaCarousel
