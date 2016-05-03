import Controls         from '../Controls';
import CommandFactory   from './command/CommandFactory';
import HelperCommand    from './command/HelperCommand';
import TopicCommand     from './command/TopicCommand';

/**
 * Slide controls provide the 'PPT' like operation for the user.
 *
 * @author hermit
 * @version 2.0.0
 * @since 1.0.0
 */
export default class SlideControl extends Controls {

    /**
     * Create a slide control.
     */
    constructor() {
        super();

        // Define attributes.
        this._index       = -1;
        this._commandTree = null;
        this._commands    = [];
    }

    /**
     * Load the operations.
     *
     * @param data command data.
     */
    load( data ) {
        this._commandTree = this._buildCommandTree( data );
        this._commands    = this._buildCommandQueue();
    }

    /**
     * Execute the specified command.
     *
     * @param index Command index.
     */
    execCommand( index ) {

        if ( !this._enable ) {
            return;
        }

        // Forward.
        if ( index > this._index ) {

            let commands = this._commands.slice( this._index + 1, index + 1 );
            commands.forEach( function ( array ) {
                array.forEach( command => command.forward( this._player.renderingEngine ) );
            }, this );
        }

        // Backward.
        if ( index < this._index ) {

            let commands = this._commands.slice( index + 1, this._index + 1 );
            commands.reverse();
            commands.forEach( function ( array ) {

                // Topic commands || helper commands.
                if ( array.length === 1 ) {
                    array[ 0 ].backward( this._player.renderingEngine );
                }

                // Topic commands && content commands.
                if ( array.length > 1 ) {
                    let topic        = array[ 0 ];
                    let content      = array[ 1 ];
                    let contentIndex = topic.children.indexOf( content );

                    if ( contentIndex === 0 ) {
                        topic.backward( this._player.renderingEngine );
                        content.backward( this._player.renderingEngine );
                    } else {
                        topic.forward( this._player.renderingEngine );
                        content.backward( this._player.renderingEngine );
                    }
                }
            }, this );
        }

        // Update current command index.
        this._index = index;
    }

    /**
     * Execute the previous command.
     */
    prevCommand() {
        if ( this._index > 0 ) {
            this.execCommand( this._index - 1 );
        }
    }

    /**
     * Execute the next command.
     */
    nextCommand() {
        if ( this._index + 1 < this._commands.length ) {
            this.execCommand( this._index + 1 );
        }
    }

    /**
     * Get the indices of commands which the command is a topic command.
     *
     * @returns {Array} An array contains the indices.
     */
    getTopicCommandIndices() {
        let indices = [];
        this._commandTree.forEach( function ( command, index ) {
            if ( command instanceof TopicCommand ) {
                indices.push( index );
            }
        } );
        return indices;
    }

    /**
     * Ge the indices of commands which the command is a helper command.
     *
     * @returns {Array} An array contains the indices.
     */
    getHelperCommandIndices() {
        let indices = [];
        this._commandTree.forEach( function ( command, index ) {
            if ( command instanceof HelperCommand ) {
                indices.push( index );
            }
        } );
        return indices;
    }

    /**
     * Get the max timeout of the command animation.
     *
     * @param index command index.
     * @returns {number}    timeout.
     */
    getMaxTimeout( index ) {
        let max = 0;
        if ( index < this._commands.length ) {
            this._commands[ index ].forEach( function ( command ) {
                max = Math.max( max, command.getMaxTimeout() );
            }, this );
        }
        return max;
    }

    _buildCommandTree( data ) {

        function create( params ) {
            let command = CommandFactory.create( params );
            if ( params.children ) {
                let children = params.children.map( create, this );
                command.add( children );
            }
            return command;
        }

        return data.commands.map( create, this );
    }

    _buildCommandQueue() {
        let queue = [];
        this._commandTree.forEach( function ( command ) {

            if ( command instanceof HelperCommand ) {
                queue.push( [ command ] );
            }

            if ( command instanceof TopicCommand ) {

                if ( command.children && command.children.length > 0 ) {
                    command.children.forEach( function ( child ) {
                        queue.push( [
                            command,
                            child
                        ] );
                    } );
                } else {
                    queue.push( [ command ] );
                }
            }
        } );
        return queue;
    }
}