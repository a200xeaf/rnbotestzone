import {useEffect, useRef} from "react";
import p5 from "p5";

interface NumboxProps {
    id: string
    value: number
    min_value: number
    max_value: number
    default_value: number
    callback: (id: string, value: number) => void
}

const Numbox1: React.FC<NumboxProps> = ({id, value, min_value, max_value, default_value, callback}) => {
    const sketchRef = useRef<HTMLDivElement>(null);
    const p5InstanceRef = useRef<p5 | null>(null);

    useEffect(() => {
        const sketch = (p: p5 & { updateValue? : (newValue: number) => void}) => {
            let isDragging: boolean = false
            let prevY: number | null = null
            let tempVal: number = value
            const currSens: number = 0.1

            const formatNumber = (formatMe: number) => {
                let final: string
                formatMe = Math.floor(formatMe)
                final = formatMe.toString()
                return final
            }

            p.setup = () => {
                p.createCanvas(70, 30)
                p.smooth();
                p.pixelDensity(2);
                p.noLoop();
            }

            p.draw = () => {
                p.clear()
                p.noFill()
                p.stroke(200)
                p.strokeWeight(3)
                p.rect(0, 0, 70, 30)
                p.noStroke()
                p.fill(0)
                p.textFont("Arial")
                p.textSize(20)
                p.text(formatNumber(tempVal), 7, (p.height / 2 + (p.width / 10)))
            }

            p.mousePressed = () => {
                if (
                    p.mouseX >= 0 &&
                    p.mouseX <= p.width &&
                    p.mouseY >= 0 &&
                    p.mouseY <= p.height
                ) {
                    isDragging = true;
                    prevY = p.mouseY;
                }
            }

            p.mouseReleased = () => {
                isDragging = false;
                prevY = null
            }

            p.mouseDragged = () => {
                if (isDragging && prevY !== null) {
                    const deltaY = p.mouseY - prevY;

                    if (deltaY < 0) {
                        tempVal += currSens * Math.abs(deltaY / 2);
                    } else if (deltaY > 0) {
                        tempVal -= currSens * Math.abs(deltaY / 2);
                    }

                    tempVal = p.constrain(tempVal, min_value, max_value)

                    prevY = p.mouseY;

                    callback(id, tempVal);
                    p.redraw()
                }
            }

            p.doubleClicked = () => {
                if (
                    p.mouseX >= 0 &&
                    p.mouseX <= p.width &&
                    p.mouseY >= 0 &&
                    p.mouseY <= p.height
                ) {
                    tempVal = default_value;
                    callback(id, tempVal);
                }
            }

            p.updateValue = (newValue: number) => {
                tempVal = newValue
                p.redraw()
            }
        }

        p5InstanceRef.current = new p5(sketch, sketchRef.current as HTMLElement);

        return () => {
            p5InstanceRef.current?.remove();
            p5InstanceRef.current = null;
        };
    }, [])

    useEffect(() => {
        if (p5InstanceRef.current) {
            (p5InstanceRef.current as any).updateValue(value);
        }
    }, [value]);

    return (
        <div className="flex flex-col justify-center items-center">
            <div ref={sketchRef}></div>
        </div>
    )
}
export default Numbox1
