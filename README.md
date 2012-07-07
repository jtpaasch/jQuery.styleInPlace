jQuery.styleInPlace
=========

A simple jQuery plugin that lets you change the basic CSS styles of an element in place. 

Simple use
----------

In its simplest form, the plugin works like tihs: to make an element editable, simply select it with jQuery, then call the styleInPlace() method. For instance, suppose we have an H1 element: 

```html
	<h1>Here is a title</h1>
```

To use the plugin for all H1 elements, simply do this with javascript: 

```javascript

	$('h1').styleInPlace();

```

Of course, that is not practical, because we usually want to initiate the editing when the user clicks on the element. Hence, we could nest the above statement inside a jQuery on('click'): 

```javascript

	// When an H1 element is clicked, do the following:
	$('h1').on('click', function() {

		// Style this element in-place:
		$(this).styleInPlace();

	});

```

Or, even better, we could do this when the document is ready: 

```javascript
	
	// When the document is ready, do the following: 
	$(document).ready(function() {

		// When an H1 element is clicked, do the following:
		$('h1').on('click', function() {

			// Style this element in-place:
			$(this).styleInPlace();

		});

	});

```
