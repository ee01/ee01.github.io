/**
 * jquery.swatchbook.js v1.1.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2012, Codrops
 * http://www.codrops.com
 */

;( function( $, window, undefined ) {
	
	'use strict';

	// global
	var Modernizr = window.Modernizr;

	jQuery.fn.reverse = [].reverse;
	
	$.SwatchBook = function( options, element ) {
		
		this.$el = $( element );
		this._init( options );
		
	};

	$.SwatchBook.defaults = {
		// index of initial centered item
		center : 6,
		// number of degrees that is between each item
		angleInc : 8,
		speed : 700,
		easing : 'ease',
		// amount in degrees for the opened item's next sibling
		proximity : 45,
		// amount in degrees between the opened item's next siblings
		neighbor : 4,
		// animate on load
		onLoadAnim : true,
		// if it should be closed by default
		initclosed : false,
		// index of the element that when clicked, triggers the open/close function
		// by default there is no such element
		closeIdx : -1,
		// open one specific item initially (overrides initclosed)
		openAt : -1
	};

	$.SwatchBook.prototype	= {

		_init : function( options ) {
			
			this.options = $.extend( true, {}, $.SwatchBook.defaults, options );

			this.$items = this.$el.children( 'div' );
			this.itemsCount = this.$items.length;
			this.current = -1;
			this.support = Modernizr.csstransitions;
			this.cache = [];
			
			if( this.options.onLoadAnim ) {
				this._setTransition();
			}

			if( !this.options.initclosed ) {
				this._center( this.options.center, this.options.onLoadAnim );
			}
			else {

				this.isClosed = true;
				if( !this.options.onLoadAnim ) {
					this._setTransition();
				}

			}

			if( this.options.openAt >= 0 && this.options.openAt < this.itemsCount ) {
				this._openItem( this.$items.eq( this.options.openAt ) );
			}
			
			this._initEvents();
			
		},
		_setTransition : function() {
		

			if( this.support ) {
				this.$items.css( { 'transition': 'all ' + this.options.speed + 'ms ' + this.options.easing } );
			}

		},
		_openclose : function() {

			this.isClosed ? $.jGrowl("抽出一张卡片试试~", {theme: 'smoke'}) : null;
		
		  var particle, theta, force, touch, max, i, j, n;

            for ( i = 0, n = demo.touches.length; i < n; i++ ) {

                touch = demo.touches[i], max = random( 300, 200);
                for ( j = 0; j < max; j++ ) {
                  demo.spawn( touch.x, touch.y );
                }

            }

			this.isClosed ? this._center( this.options.center, true ) : this.$items.css( { 'transform' : 'rotate(0deg)', 'opacity' : 1 } );
			this.isClosed = !this.isClosed;

		},
		_center : function( idx, anim ) {

			var self = this;

			this.$items.each( function( i ) {

				var transformStr = 'rotate(' + ( self.options.angleInc * ( i - idx ) ) + 'deg)';
				$( this ).css( { 'transform' : transformStr } );

			} );

		},
		_openItem : function( $item ) {

			
			var itmIdx = $item.index();
			
			if( itmIdx !== this.current ) {

				if( this.options.closeIdx !== -1 && itmIdx === this.options.closeIdx ) {

					this._openclose();
					this._setCurrent();

				}
				else {

					this._setCurrent( $item );
					$item.css( { 'transform' : 'rotate(0deg)' } );
					this._rotateSiblings( $item );

				}

			}else{
				if ($item.hasClass('ff-active') && $item.data('href')) {
					$item.css({
						transform: 'translateY(-50px)',
						opacity: 0.2
					});
					setTimeout(function() {
						// $("#Jump").fadeTo(200, 1);
						$("#Loading").fadeTo(200, 1);
						ui.dialog('Overlay time').overlay({ closable: false }).showno();
						window.location.href = $item.data('href');
					}, this.options.speed-100);
				}
			}

		},
		_initEvents : function() {

			var self = this;
			
			this.$items.on( 'click.swatchbook', function( event ) {
				self._openItem( $( this ) );
			} );
			// var timerSwatchbook;
			// this.$items.on( 'mouseenter.swatchbook', function( event ) {
			// 	var _this = this;
			// 	timerSwatchbook = setTimeout(function() {
			// 		self._openItem( $( _this ) );
			// 	}, 200);
			// } ).on( 'mouseleave', function( event ) {
			// 	console.log(timerSwatchbook)
			// 	clearTimeout(timerSwatchbook);
			// } );

		},
		_rotateSiblings : function( $item ) {
		
		
			var self = this,
				idx = $item.index(),
				$cached = this.cache[ idx ],
				$siblings;

			if( $cached ) {
				$siblings = $cached;
			}
			else {

				$siblings = $item.siblings();
				this.cache[ idx ] = $siblings;
				
			}

			$siblings.each( function( i ) {

				var rotateVal = i < idx ? 
					self.options.angleInc * ( i - idx ) : 
					i - idx === 1 ?
						self.options.proximity : 
						self.options.proximity + ( i - idx - 1 ) * self.options.neighbor;

				var transformStr = 'rotate(' + rotateVal + 'deg)';

				$( this ).css( { 'transform' : transformStr, 'opacity' : 1 } );

			} );

		},
		_setCurrent : function( $el ) {

			this.current = $el ? $el.index() : -1;
			this.$items.removeClass( 'ff-active' );
			if( $el ) {
				$el.addClass( 'ff-active' );
			}

		}

	};
	
	var logError			= function( message ) {

		if ( window.console ) {

			window.console.error( message );
		
		}

	};
	
	$.fn.swatchbook			= function( options ) {
		
		var instance = $.data( this, 'swatchbook' );
		
		if ( typeof options === 'string' ) {
			
			var args = Array.prototype.slice.call( arguments, 1 );
			
			this.each(function() {
			
				if ( !instance ) {

					logError( "cannot call methods on swatchbook prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				
				}
				
				if ( !$.isFunction( instance[options] ) || options.charAt(0) === "_" ) {

					logError( "no such method '" + options + "' for swatchbook instance" );
					return;
				
				}
				
				instance[ options ].apply( instance, args );
			
			});
		
		} 
		else {
		
			this.each(function() {
				
				if ( instance ) {

					instance._init();
				
				}
				else {

					instance = $.data( this, 'swatchbook', new $.SwatchBook( options, this ) );
				
				}

			});
		
		}
		
		return instance;
		
	};
	
} )( jQuery, window );