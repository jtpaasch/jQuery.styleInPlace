/**
 * 
 * STYLE IN PLACE
 * --------------------------------------
 * 
 * A jQuery plugin that lets you change common CSS styles of an element in place.
 * 
 * Example usage: make an element with an ID of #title stylable when you click it:
 *
 * 		$('#title').on('click', function() {
 * 			$(this).styleInPlace();
 * 		});
 *
 * All CSS changes are saved, and they can be passed to a 'save' callback if you 
 * specify one. For instance: 
 *
 * 		function onSave(changes) {
 * 			console.log(changes);
 * 		}
 *
 * 		$('#title').on('click', function() {
 * 			$(this).styleInPlace({
 * 				save: onSave
 * 			});
 * 		});
 * 		
 * @author JT Paasch
 * @version 1
 * @copyright June 2012
 */

(function($) {

	$.fn.styleInPlace = function(options) {

		/**
		 * A dictionary of default settings.
		 * @type {Object} 
		 */
		var defaults = {
			styles: 'default',
			save: function() { return null; }
		};

		/**
		 * Use jquery's extend() method to add any options parameters
		 * to the defaults object.
		 */
		var options = $.extend(defaults, options);

		/**
		 * The default HTML for the lightbox. 
		 * @type {String}
		 */
		var lightbox_pane = '<div id="style-in-place-lightbox" style="display: none;">' +
			'	<div class="style-in-place-lightbox-top-row"></div>' +
			'	<div class="style-in-place-lightbox-middle-row">' +
			'		<div class="style-in-place-lightbox-middle-row-left-column"></div>' +
			'		<div class="style-in-place-lightbox-middle-row-center-column"></div>' +
			'		<div class="style-in-place-lightbox-middle-row-right-column"></div>' +
			'	</div>' +
			'	<div class="style-in-place-lightbox-bottom-row">' +
			'		<div class="style-in-place-lightbox-editor-pane">' +
			'			<div class="style-in-place-lightbox-editor-pane-top-row">' +
			'				<div class="style-in-place-lightbox-editor-pane-top-row-left-column">' +
			'					<div>' +
			'						<h3>Font</h3>' +
			'						<ul>' +
			'							<li>' +
			'								<span class="style-in-place-editor-pane-label">' + 
			'									Font family' + 
			'								</span>' +
			'								<span class="style-in-place-editor-pane-value" ' + 
			'									  id="style-in-place-editor-pane-font-family">' + 
			'									Font family' + 
			'								</span>' +
			'							</li>' +
			'							<li>' +
			'								<span class="style-in-place-editor-pane-label">' + 
			'									Font size' + 
			'								</span>' +
			'								<span class="style-in-place-editor-pane-value" ' + 
			'									  id="style-in-place-editor-pane-font-size">' + 
			'									Font size' + 
			'								</span>' +
			'							</li>' +
			'							<li>' +
			'								<span class="style-in-place-editor-pane-label">' + 
			'									Line height' + 
			'								</span>' +
			'								<span class="style-in-place-editor-pane-value" ' + 
			'									  id="style-in-place-editor-pane-line-height">' + 
			'									Line height' + 
			'								</span>' +
			'							</li>' +
			'							<li>' +
			'								<span class="style-in-place-editor-pane-label">' + 
			'									Weight' + 
			'								</span>' +
			'								<span class="style-in-place-editor-pane-value" ' + 
			'									  id="style-in-place-editor-pane-font-weight">' + 
			'									Weight' + 
			'								</span>' +
			'							</li>' +
			'							<li>' +
			'								<span class="style-in-place-editor-pane-label">' + 
			'									Slant' + 
			'								</span>' +
			'								<span class="style-in-place-editor-pane-value" ' + 
			'									  id="style-in-place-editor-pane-font-style">' + 
			'									None' + 
			'								</span>' +
			'							</li>' +
			'							<li>' +
			'								<span class="style-in-place-editor-pane-label">' + 
			'									Underline' + 
			'								</span>' +
			'								<span class="style-in-place-editor-pane-value" ' + 
			'									  id="style-in-place-editor-pane-text-decoration">' + 
			'									None' + 
			'								</span>' +
			'							</li>' +
			'							<li>' +
			'								<span class="style-in-place-editor-pane-label">' + 
			'									Case' + 
			'								</span>' +
			'								<span class="style-in-place-editor-pane-value" ' + 
			'									  id="style-in-place-editor-pane-text-transform">' + 
			'									None' + 
			'								</span>' +
			'							</li>' +
			'							<li>' +
			'								<span class="style-in-place-editor-pane-label">' + 
			'									Color' + 
			'								</span>' +
			'								<span class="style-in-place-editor-pane-value" ' + 
			'									  id="style-in-place-editor-pane-color">' + 
			'									Default' + 
			'								</span>' +
			'							</li>' +
			'							<li>' +
			'								<span class="style-in-place-editor-pane-label">' + 
			'									Alignment' + 
			'								</span>' +
			'								<span class="style-in-place-editor-pane-value" ' + 
			'									  id="style-in-place-editor-pane-text-align">' + 
			'									Left' + 
			'								</span>' +
			'							</li>' +
			'						</ul>' +
			'					</div>' +
			'				</div>' +
			'				<div class="style-in-place-lightbox-editor-pane-top-row-right-column">' +
			'					<div>' +
			'						<h3>Dimensions</h3>' +
			'						<ul>' +
			'							<li>' +
			'								<span class="style-in-place-editor-pane-label">' + 
			'									Width' + 
			'								</span>' +
			'								<span class="style-in-place-editor-pane-value" ' + 
			'									  id="style-in-place-editor-pane-width">' + 
			'									Default' + 
			'								</span>' +
			'							</li>' +
			'							<li>' +
			'								<span class="style-in-place-editor-pane-label">' + 
			'									Height' + 
			'								</span>' +
			'								<span class="style-in-place-editor-pane-value" ' + 
			'									  id="style-in-place-editor-pane-height">' + 
			'									Default' + 
			'								</span>' +
			'							</li>' +
			'						</ul>' +
			'					</div>' +
			'					<div>' +
			'						<h3>Margins and padding</h3>' +
			'						<ul>' +
			'							<li>' +
			'								<span class="style-in-place-editor-pane-label">' + 
			'									Margin' + 
			'								</span>' +
			'								<span class="style-in-place-editor-pane-value" ' + 
			'									  id="style-in-place-editor-pane-margin">' + 
			'									Default' + 
			'								</span>' +
			'							</li>' +
			'							<li>' +
			'								<span class="style-in-place-editor-pane-label">' + 
			'									Padding' + 
			'								</span>' +
			'								<span class="style-in-place-editor-pane-value" ' + 
			'									  id="style-in-place-editor-pane-padding">' + 
			'									Default' + 
			'								</span>' +
			'							</li>' +
			'						</ul>' +
			'					</div>' +
			'				</div>' +
			'			</div>' +
			'			<div class="style-in-place-lightbox-editor-pane-bottom-row">' +
			'				<button class="style-in-place-lightbox-editor-pane-done-button">' + 
			'					Done' + 
			'				</button>' +
			'			</div>' +
			'		</div>' +
			'	</div>' +
			'</div>';

		/**
		 * This will store a reference to the element getting styled.
		 */
		var self;

		/**
		 * This will store a reference to the lightbox element.
		 */
		var lightbox;

		/**
		 * This flag specifies if the lightbox is open or not.
		 * @type {Boolean}
		 */
		var lightbox_is_open = false;

		/**
		 * This sets the color for the editor pane in the lightbox.
		 * @type {String}
		 */
		var editor_pane_color = 'white';

		/**
		 * This sets the background opacity for the lightbox.
		 * @type {String}
		 */
		var lightbox_bg_opacity = '0.8';

		/**
		 * A dictionary of CSS changes.
		 * @type {Object}
		 */
		var changes = {};

		/**
		 * Register a CSS property/value pair. 
		 * @param  {String} property The name of the CSS property.
		 * @param  {String} value    The value of the CSS property.
		 */
		var register_change = function(property, value) {
			changes[property] = value;
		};

		/**
		 * This method styles the lightbox in the default way. 
		 * TO DO: Add the ability to override these styles.
		 */
		var default_styles = function() {
			$('#style-in-place-lightbox').css({
				'position': 'absolute',
				'width': '100%',
				'height': '100%',
				'top': 0,
				'left': 0,
				'color': editor_pane_color,
				'font-family': 'Arial, sans-serif',
				'font-size': '13px'
			});
			$('.style-in-place-lightbox-top-row').css({
				'background': 'black',
				'opacity': lightbox_bg_opacity,
				'width': '100%'
			});
			$('.style-in-place-lightbox-middle-row').css({
				'width': '100%'
			});
			$('.style-in-place-lightbox-middle-row-left-column').css({
				'background': 'black',
				'opacity': lightbox_bg_opacity,
				'position': 'relative',
				'display': 'inline-block',
				'height': '100%',
				'float': 'left'
			});
			$('.style-in-place-lightbox-middle-row-center-column').css({
				'position': 'relative',
				'display': 'inline-block',
				'height': '100%',
				'float': 'left'
			});
			$('.style-in-place-lightbox-middle-row-right-column').css({
				'background': 'black',
				'opacity': lightbox_bg_opacity,
				'position': 'relative',
				'display': 'inline-block',
				'height': '100%',
				'float': 'left'
			});
			$('.style-in-place-lightbox-bottom-row').css({
				'background': 'black',
				'opacity': lightbox_bg_opacity,
				'height': '100%'
			});
			$('.style-in-place-lightbox-editor-pane').css({
				'padding': '50px'
			});
			$('.style-in-place-lightbox-editor-pane-top-row-left-column').css({
				'position': 'relative',
				'display': 'inline-block',
				'vertical-align': 'top',
				'width': '300px',
				'margin-right': '50px'
			});
			$('.style-in-place-lightbox-editor-pane-top-row-right-column').css({
				'position': 'relative',
				'display': 'inline-block',
				'vertical-align': 'top',
				'width': '300px'
			});
			$('.style-in-place-lightbox-editor-pane-top-row h3').css({
				'text-transform': 'uppercase',
				'background': editor_pane_color,
				'color': 'black',
				'border-radius': '3px',
				'-moz-border-radius': '3px',
				'padding': '5px 10px 4px 10px',
				'margin-bottom': '10px'
			});
			$('.style-in-place-lightbox-editor-pane-top-row ul').css({
				'padding': '0',
				'margin': '20px 0 30px 0'
			});
			$('.style-in-place-lightbox-editor-pane-top-row ul li').css({
				'padding': '0',
				'margin': '5px 3px 15px 3px',
				'list-style-type': 'none',
				'border-bottom': '1px dotted ' + editor_pane_color
			});
			$('.style-in-place-editor-pane-label').css({
				'display': 'inline-block',
				'text-transform': 'uppercase',
				'font-size': '11px'
			});
			$('.style-in-place-editor-pane-value').css({
				'display': 'inline-block',
				'font-weight': 'bold',
				'font-size': '14px',
				'float': 'right'
			});
			$('.style-in-place-lightbox-editor-pane-bottom-row').css({
				'margin': '20px 0'
			});
			$('.style-in-place-lightbox-editor-pane-done-button').css({
				'font-family': 'Arial, sans-serif',
				'font-size': '13px',
				'border': '0',
				'border-radius': '3px',
				'-moz-border-radius': '3px',
				'background': editor_pane_color,
				'text-transform': 'uppercase',
				'font-weight': 'bold',
				'padding': '5px 10px 4px 10px'
			});
			
		};

		/**
		 * This method opens the lightbox, and while doing so, it sets the 
		 * 'lightbox_is_open' flag and reframes the lightbox to the browser size.
		 */
		var open_lightbox = function() {
			lightbox_is_open = true;
			reframe();
			lightbox.fadeIn(150, function() {
				reframe();
			});
		};

		/**
		 * This method closes the lightbox, removes it, and unsets 
		 * the 'lightbox_is_open' flag.
		 */
		var close_lightbox = function() {
			lightbox.fadeOut(150, function() {
				lightbox_is_open = false;
				$(this).remove();
			});
		};

		/**
		 * This method resizes the lightbox to fit the browser size.
		 */
		var reframe = function() {
			
			// This method gets called whenever the browser is resized,
			// but there is no need to reframe the lightbox if it isn't open.
			// In that case, just exit this method altogether.
			if (!lightbox_is_open) {
				return false;
			}
			
			// Get references to the top, middle, and bottom rows.
			var top_row = lightbox.find('.style-in-place-lightbox-top-row');
			var middle_row = lightbox.find('.style-in-place-lightbox-middle-row');
			var bottom_row = lightbox.find('.style-in-place-lightbox-bottom-row');

			// Get references to the columns in the middle row.
			var middle_left_column = lightbox.find('.style-in-place-lightbox-middle-row-left-column');
			var middle_center_column = lightbox.find('.style-in-place-lightbox-middle-row-center-column');
			var middle_right_column = lightbox.find('.style-in-place-lightbox-middle-row-right-column');
			
			// Get the position and dimensions of the element getting styled.
			var pos = self.position();
			var x = pos.left;
			var y = pos.top;
			var wd = self.outerWidth(true);
			var ht = self.outerHeight(true);
			
			// Set the top row's height and the middle row's height.
			top_row.css('height', y);
			middle_row.css('height', ht);

			// Calculate the total width of the left and center columns of the middle row.
			var middle_row_initial_width = x + wd;

			// If the left and center columns of the middle row are wider than 
			// the top row, set the top row to the width of the middle row.
			var lightbox_width = top_row.width();
			if (middle_row_initial_width > lightbox_width) {
				lightbox_width = middle_row_initial_width;
			}

			// If the top row's width is less than the window's width,
			// set the top row's width to the window's width.
			var window_width = $(window).width();
			if (window_width > lightbox_width) {
				lightbox_width = window_width;
			}

			// Set the top, middle, and bottom row's width to the width that has been 
			// established for the lightbox.
			top_row.css('width', lightbox_width);
			middle_row.css('width', lightbox_width);
			bottom_row.css('width', lightbox_width);

			// Set the width and height of the left column in the middle row. 
			middle_left_column.css({
				'width': x,
				'height': ht
			});
			
			// Set the width of the center column in the middle row.
			middle_center_column.css({
				'width': wd
			});
			
			// Set the width of the right column in the middle row.
			var remaining_width = lightbox_width - (x + wd);
			middle_right_column.css('width', remaining_width);

			// Set the height of the bottom row
			var editor_pane = lightbox.find('.style-in-place-lightbox-editor-pane');
			var editor_ht = editor_pane.outerHeight();
			var bottom_ht = bottom_row.outerHeight();
			if (editor_ht > bottom_ht) {
				bottom_row.css('height', editor_ht);
			}
			
		};

		/**
		 * This changes a specific CSS property of the element getting styled,
		 * then it reframes the lightbox to fit the browser size.
		 * @param  {mixed} value    The value of the new property.
		 * @param  {String} property The name of the CSS property to change.
		 */
		var change_css_property = function(value, property) {
			self.css(property, $.trim(value));
			register_change(property, value);
			reframe();
			setup_current_property_values();
		};

		/**
		 * This changes the width or height of an element. If the element is inline,
		 * it is changed to inline-block so that width or height can actually be set.
		 * @param  {String} value The new width or height.
		 * @param  {String} type  The type of value: 'width' or 'height'.
		 */
		var change_dimensions = function(value, type) {
			if (self.css('display') === 'inline') {
				self.css('display', 'inline-block');
			}
			self.css(type, $.trim(value));
			register_change(type, value);
			reframe();
			setup_current_property_values();
		}

		/**
		 * This takes a shorthand "margin" or "padding" string (e.g., '20px 10px'), 
		 * parses it, and then changes each margin or padding accordingly.
		 * @param  {String} value The shorthand margin or padding string.
		 * @param  {String} type  The type of value: 'margin' or 'padding'.
		 */
		var change_margin_or_padding = function(value, type) {
			var parts = value.split(' ');
			if (parts.length === 1) {
				var val = $.trim(parts[0]);
				self.css(type + '-top', val);
				self.css(type + '-right', val);
				self.css(type + '-bottom', val);
				self.css(type + '-left', val);
			} else if (parts.length === 2) {
				var val_1 = $.trim(parts[0]);
				var val_2 = $.trim(parts[1]);
				self.css(type + '-top', val_1);
				self.css(type + '-right', val_2);
				self.css(type + '-bottom', val_1);
				self.css(type + '-left', val_2);
			} else if (parts.length === 4) {
				self.css(type + '-top', $.trim(parts[0]));
				self.css(type + '-right', $.trim(parts[1]));
				self.css(type + '-bottom', $.trim(parts[2]));
				self.css(type + '-left', $.trim(parts[3]));
			}
			register_change(type, value);
			reframe();
			setup_current_property_values();
		}

		/**
		 * Get a shorthand "margin" or "padding" string (e.g., '20px 10px').
		 * @param  {String} type The type of value: 'margin' or 'padding'.
		 * @return {String}      The shorthand margin or padding string.
		 */
		var get_margin_or_padding = function(type) {
			var value = '';
			value += parseInt(self.css(type + '-top')) + 'px ';
			value += parseInt(self.css(type + '-right')) + 'px ';
			value += parseInt(self.css(type + '-bottom')) + 'px ';
			value += parseInt(self.css(type + '-left')) + 'px';
			return value;
		};

		/**
		 * This sets the CSS properties in the lightbox's editor pane to their 
		 * current values. 
		 */
		var setup_current_property_values = function() {
			$('#style-in-place-editor-pane-font-family').html(self.css('font-family'));
			$('#style-in-place-editor-pane-font-size').html(self.css('font-size'));
			$('#style-in-place-editor-pane-line-height').html(self.css('line-height'));
			$('#style-in-place-editor-pane-font-weight').html(self.css('font-weight'));
			$('#style-in-place-editor-pane-font-style').html(self.css('font-style'));
			$('#style-in-place-editor-pane-text-decoration').html(self.css('text-decoration'));
			$('#style-in-place-editor-pane-text-transform').html(self.css('text-transform'));
			$('#style-in-place-editor-pane-color').html(self.css('color'));
			$('#style-in-place-editor-pane-text-align').html(self.css('text-align'));
			$('#style-in-place-editor-pane-width').html(self.css('width'));
			$('#style-in-place-editor-pane-height').html(self.css('height'));
			$('#style-in-place-editor-pane-margin').html(get_margin_or_padding('margin'));
			$('#style-in-place-editor-pane-padding').html(get_margin_or_padding('padding'));
		};

		/**
		 * This sets up each CSS property editor in the lightbox's editor pane. 
		 */
		var setup_property_editors = function() {
			
			// The font-family editor.
			$('#style-in-place-editor-pane-font-family').on('click', function() {
				edit_list($(this), 
					{
						'arial': 'Arial, sans-serif',
						'verdana': 'Verdana, sans-serif',
						'georgia': 'Georgia, serif',
						'times': 'Times, serif'
					},
					{
						callback: change_css_property,
						parameters: 'font-family'
					}
				);
			});

			// The font size editor.
			$('#style-in-place-editor-pane-font-size').on('click', function() {
				edit_text($(this), {
					callback: change_css_property,
					parameters: 'font-size'
				});
			});

			// The line height editor.
			$('#style-in-place-editor-pane-line-height').on('click', function() {
				edit_text($(this), {
					callback: change_css_property,
					parameters: 'line-height'
				});
			});

			// The font-weight editor.
			$('#style-in-place-editor-pane-font-weight').on('click', function() {
				edit_list($(this), 
					{
						'normal': 'normal',
						'bold': 'bold'
					},
					{
						callback: change_css_property,
						parameters: 'font-weight'
					}
				);
			});

			// The font-style editor.
			$('#style-in-place-editor-pane-font-style').on('click', function() {
				edit_list($(this), 
					{
						'normal': 'normal',
						'italic': 'italic'
					},
					{
						callback: change_css_property,
						parameters: 'font-style'
					}
				);
			});

			// The text-decoration editor.
			$('#style-in-place-editor-pane-text-decoration').on('click', function() {
				edit_list($(this), 
					{
						'none': 'none',
						'underline': 'underline'
					},
					{
						callback: change_css_property,
						parameters: 'text-decoration'
					}
				);
			});

			// The text-transform editor.
			$('#style-in-place-editor-pane-text-transform').on('click', function() {
				edit_list($(this), 
					{
						'none': 'none',
						'uppercase': 'uppercase',
						'lowercase': 'lowercase',
						'capitalize': 'capitalize'
					},
					{
						callback: change_css_property,
						parameters: 'text-transform'
					}
				);
			});

			// The font color editor.
			$('#style-in-place-editor-pane-color').on('click', function() {
				edit_text($(this), {
					callback: change_css_property,
					parameters: 'color'
				});
			});

			// The text-align editor.
			$('#style-in-place-editor-pane-text-align').on('click', function() {
				edit_list($(this), 
					{
						'left': 'left',
						'center': 'center',
						'right': 'right'
					},
					{
						callback: change_css_property,
						parameters: 'text-align'
					}
				);
			});

			// The width editor.
			$('#style-in-place-editor-pane-width').on('click', function() {
				edit_text($(this), {
					callback: change_dimensions,
					parameters: 'width'
				});
			});

			// The height editor.
			$('#style-in-place-editor-pane-height').on('click', function() {
				edit_text($(this), {
					callback: change_dimensions,
					parameters: 'height'
				});
			});

			// The margin editor.
			$('#style-in-place-editor-pane-margin').on('click', function() {
				edit_text($(this), {
					callback: change_margin_or_padding,
					parameters: 'margin'
				});
			});

			// The padding editor.
			$('#style-in-place-editor-pane-padding').on('click', function() {
				edit_text($(this), {
					callback: change_margin_or_padding,
					parameters: 'padding'
				});
			});

		};

		/**
		 * The HTML for the in-place editor's textarea box.
		 * @type {String}
		 */
		var textarea_pane = '<textarea class="style-in-place-lightbox-textarea-pane"></textarea>';
		
		/**
		 * This lets you edit a value in-place with a textarea box.
		 * @param  {Element} item    The element to edit.
		 * @param  {Object} options  A list of options: 
		 *                           (a) callback: the function to call when editing is done,
		 *                           (b) parameters: an object to pass to the callback.
		 */
		var edit_text = function(item, options) {
			
			// Create the textarea pane.
			var pane = $(textarea_pane);

			// Get the width, height, and contents of the item to edit.
			pane.attr('width', item.innerWidth());
			pane.attr('height', item.innerHeight());
			pane.val($.trim(item.html()));

			// Make sure that clicking on the item does nothing
			// (we don't want to edit the textarea if you click _it_).
			pane.on('click', false);

			// Put the item's contents into the textarea pane.
			item.html(pane);

			// Position the textarea pane absolutely, in the same spot 
			// as the item getting edited.
			var position = pane.offset();
			pane.css('position', 'absolute');
			pane.offset(position);

			// Focus the cursor in the textarea pane.
			pane.focus();

			// When the focus leaves the textarea pane, replace the item with 
			// whatever was entered into the textarea pane, and execute the callback.
			pane.on('blur', function() {
				var val = $(this).val();
				item.html(val);
				if (options.callback !== undefined) {
					var params = (options.parameters === undefined) ? null : options.parameters;
					options.callback(val, params);
				}
			});
		};

		/**
		 * The HTML for in-place editor's select/dropdown list.
		 * @type {String}
		 */
		var select_pane = '<select class="style-in-place-lightbox-select-pane"></select>';
		
		/**
		 * This lets you edit a value in-place by selecting from a dropdown list.
		 * @param  {Element} item        The element to edit.
		 * @param  {Object} list_options A list of values to place in the dropdown.
		 * @param  {Object} options      A list of options:
		 *                               (a) callback: the function to call when editing is done,
		 *                               (b) parameters: an object to pass to the callback.
		 */
		var edit_list = function(item, list_options, options) {
			
			// Create the <select> element, and add the list of <option> elements to it.
			var list = $(select_pane), items = '', current = item.html(), key, list_length = 0;
			for (key in list_options) {
				if (list_options.hasOwnProperty(key)) {
					list_length += 1;
					items += (current === list_options[key]) ? '<option selected>' : '<option>';
					items += list_options[key] + '</option>' + "\n";
				}
			}
			list.html(items);

			// Make sure clicking on the dropdown does nothing 
			// (we don't want to edit the dropdown itself).
			list.on('click', false);

			// Expand the dropdown, and position it absolutely in the same 
			// spot as the item getting edited.
			list.attr('size', list_length);
			item.html(list);
			var position = list.offset();
			list.css('position', 'absolute');
			list.offset(position);

			// When the user clicks on an option in the dropdown, put that option
			// back into the item getting edited, and execute the callback.
			list.on('click', function() {
				var val = $(this).val();
				item.html(val);
				if (options.callback !== undefined) {
					var params = (options.parameters === undefined) ? null : options.parameters;
					options.callback(val, params);
				}
			});
		};

		/**
		 * For each element selected by this jQuery plugin, do the following:
		 */
		return this.each(function() {
			
			// Set 'self' to this particular element (wrapped in the jQuery object).
			self = $(this); 
			
			// Create the lightbox if it doesn't exist yet. 
			// Otherwise, get a reference to it.
			if ($('#style-in-place-lightbox').length < 1) {
				lightbox = $(lightbox_pane);
				$('body').append(lightbox); 
				if (options.styles === 'default') {
					default_styles(); 
				}
			} else {
				lightbox = $('#style-in-place-lightbox');
			}

			// Reframe the lightbox on browser resize.
			$(window).resize(function() { 
				reframe();
			});

			// Close the lightbox if the user clicks on the following.
			var close_if_clicked =	'.style-in-place-lightbox-top-row, ' + 
				'.style-in-place-lightbox-middle-row, ' +
				'.style-in-place-lightbox-editor-pane-done-button'; 
			lightbox.find(close_if_clicked).on('click', function() {
				close_lightbox();
				if (defaults.save !== undefined) {
					defaults.save(changes);
				}
			});
			
			// Setup current property values.
			setup_current_property_values();

			// Setup the property editors.
			setup_property_editors();

			// Open the overlay/lightbox.
			open_lightbox(); 
			
		});
	};

})(jQuery)