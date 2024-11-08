import { useEffect, useRef } from "react";
import p5 from "p5";
import { scaleExp } from "./utils.ts";

interface SliderProps {
    id: string;
    value: number;
    min_value: number;
    max_value: number;
    default_value: number;
    callback: (id: string, value: number) => void;
    scale_exponent?: number;
    orientation?: 'horizontal' | 'vertical';
    filled?: boolean; // New prop to fill the slider
}

const Slider1: React.FC<SliderProps> = ({
                                            id,
                                            value,
                                            min_value,
                                            max_value,
                                            default_value,
                                            callback,
                                            scale_exponent = 1,
                                            orientation = 'horizontal',
                                            filled = false, // Default is unfilled
                                        }) => {
    const sketchRef = useRef<HTMLDivElement>(null);

    const valueToPosition = (value: number): number => {
        return scaleExp(value, min_value, max_value, 0, 1, scale_exponent);
    };

    const positionToValue = (position: number): number => {
        // Removed the 'true' parameter to fix the inversion issue
        return scaleExp(position, 0, 1, min_value, max_value, scale_exponent);
    };

    const p5InstanceRef = useRef<p5 | null>(null);

    useEffect(() => {
        const sketch = (p: p5 & { updatePosition?: (newPosition: number) => void }) => {
            const width = orientation === 'horizontal' ? 100 : 20;
            const height = orientation === 'horizontal' ? 20 : 100;
            const trackLength = orientation === 'horizontal' ? width - 20 : height - 20; // Leave space for thumb
            const thumbSize = 10;

            let position = valueToPosition(value); // Value between 0 and 1

            let isDragging = false;

            p.setup = () => {
                p.createCanvas(width, height);
                p.smooth();
                p.pixelDensity(2);
                p.clear();
                p.noLoop();
            };

            p.draw = () => {
                p.clear();

                // Draw track background
                p.stroke(200);
                p.strokeWeight(4); // Increased the thickness of the bar
                p.noFill();

                if (orientation === 'horizontal') {
                    p.line(10, p.height / 2, p.width - 10, p.height / 2);
                } else {
                    p.line(p.width / 2, 10, p.width / 2, p.height - 10);
                }

                // Draw filled part if 'filled' prop is true
                if (filled) {
                    p.stroke(50, 240, 255);
                    if (orientation === 'horizontal') {
                        let x = 10 + position * trackLength;
                        p.line(10, p.height / 2, x, p.height / 2);
                    } else {
                        let y = p.height - 10 - position * trackLength;
                        p.line(p.width / 2, p.height - 10, p.width / 2, y);
                    }
                }

                // Draw thumb
                p.fill(50, 240, 255);
                p.noStroke();

                if (orientation === 'horizontal') {
                    let x = 10 + position * trackLength;
                    let y = p.height / 2;
                    p.circle(x, y, thumbSize);
                } else {
                    let x = p.width / 2;
                    let y = p.height - 10 - position * trackLength;
                    p.circle(x, y, thumbSize);
                }
            };

            p.mousePressed = () => {
                if (
                    p.mouseX >= 0 &&
                    p.mouseX <= p.width &&
                    p.mouseY >= 0 &&
                    p.mouseY <= p.height
                ) {
                    isDragging = true;
                    p.loop();
                    updatePositionFromMouse();
                }
            };

            p.mouseReleased = () => {
                isDragging = false;
                p.noLoop();
            };

            p.mouseDragged = () => {
                if (isDragging) {
                    updatePositionFromMouse();
                }
            };

            p.doubleClicked = () => {
                if (
                    p.mouseX >= 0 &&
                    p.mouseX <= p.width &&
                    p.mouseY >= 0 &&
                    p.mouseY <= p.height
                ) {
                    position = valueToPosition(default_value);
                    p.redraw();
                    const newValue = positionToValue(position);
                    callback(id, newValue);
                }
            };

            const updatePositionFromMouse = () => {
                if (orientation === 'horizontal') {
                    let mouseX = p.constrain(p.mouseX, 10, p.width - 10);
                    position = (mouseX - 10) / trackLength;
                } else {
                    let mouseY = p.constrain(p.mouseY, 10, p.height - 10);
                    position = (p.height - 10 - mouseY) / trackLength;
                }
                position = p.constrain(position, 0, 1);
                p.redraw();

                const newValue = positionToValue(position);
                callback(id, newValue);
            };

            // Expose method to update position from outside the sketch
            p.updatePosition = (newPosition: number) => {
                position = newPosition;
                p.redraw();
            };
        };

        p5InstanceRef.current = new p5(sketch, sketchRef.current as HTMLElement);

        return () => {
            p5InstanceRef.current?.remove();
            p5InstanceRef.current = null;
        };
    }, [min_value, max_value, orientation, filled]); // Added 'filled' to dependencies

    useEffect(() => {
        if (p5InstanceRef.current) {
            const newPosition = valueToPosition(value);
            (p5InstanceRef.current as any).updatePosition(newPosition);
        }
    }, [value]);

    return (
        <div className="flex flex-col justify-center items-center">
            <div ref={sketchRef}></div>
            <span>{value.toFixed(2)}</span> {/* Display the current value */}
        </div>
    );
};

export default Slider1;