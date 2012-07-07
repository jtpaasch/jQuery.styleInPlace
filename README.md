jQuery.styleInPlace
=========

A simple jQuery plugin that lets you change the basic CSS styles of an element in place. 

Use
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
	
	// When the document is ready, do the following: 
	$(document).ready(function() {

		// When an H1 element is clicked, do the following:
		$('h1').on('click', function() {

			// Style this element in-place:
			$(this).styleInPlace();

		});

	});
```
