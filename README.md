jQuery.styleInPlace
=========

A simple jQuery plugin that lets you change the basic CSS styles of an element in place. 

To see it in action, look at the [the demo](http://jpaasch.github.com/jQuery.styleInPlace/), or try it on your local machine: download the zip or fork the project, then open index.html in a browser. 

Basic usage
----------

In its simplest form, the plugin works like this: to make an element editable, select it with jQuery, then call the styleInPlace() method. For instance, suppose we have an H1 element somewhere in our document: 

```html
<h1>Here is a title</h1>
```

To use the plugin for all H1 elements, we could do this at the end of the document: 

```javascript
<script>
	$('h1').styleInPlace();
</script>
```

Of course, that is not practical, because we usually want to initiate the editing after some event, e.g., when the user clicks on the element. Hence, we could nest the above javascript statement inside a jQuery on('click'):

```javascript
<script>

	// When an H1 element is clicked, do the following:
	$('h1').on('click', function() {

		// Style this element in-place:
		$(this).styleInPlace();

	});

</script>
```

Or, even better, we could do this when the document is ready: 

```javascript
<script>

	// When the document is ready, do the following: 
	$(document).ready(function() {

		// When an H1 element is clicked, do the following:
		$('h1').on('click', function() {

			// Style this element in-place:
			$(this).styleInPlace();

		});

	});

</script>
```

Saving changes
------------------

The plugin makes a record of any CSS changes you make. You can pass these changes to a callback by specifying a 'save' method in the options you pass to the styleInPlace() method. In that callback, you might then pass those changes to a backend script, which then could update the CSS files. For instance: 

```javascript
<script>
	
	// A function that handles any CSS changes made with the plugin:
	function when_done(changes) {
		
		// Output the changes to the console.
		console.log(changes);

		// You could then use ajax or whatever to send 
		// these changes to the backend, at which point
		// you could update CSS files.
		$.ajax(...);
	}

	// When the document is ready, do the following: 
	$(document).ready(function() {

		// When an H1 element is clicked, do the following:
		$('h1').on('click', function() {

			// Style this element in-place. When finished,
			// pass the changes to the function when_done():
			$(this).styleInPlace({
				save: when_done
			});

		});

	});

</script>
```

Caveats
--------------

This plugin is a proof-of-concept, which is to say that there may very well be bugs. I have tried to find all the bugs I can, but I have not been systematic about my testing, so I could have overlooked any number of bugs. I plan to do more systematic testing for the plugin at some point in the near future, but I have not done so at present. 

I should also note that this plugin only allows you to edit an incomplete list of CSS properties. These are the properties that I find to be most frequently useful, but that is not to say that there are other CSS properties that others might need to edit on a regular basis. I plan to add more properties to this plugin as needed. 