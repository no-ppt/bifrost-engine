/**
 *
 * @author hermit
 * @version 1.0.0
 */
export default class TweenConfig {

    static set enable( value ) {
        TweenConfig._enable = value;
    }

    static get enable() {
        return TweenConfig._enable;
    }
}

TweenConfig._enable = true;