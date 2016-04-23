// This file was taken directly from EaselJS source code
// https://github.com/CreateJS/EaselJS/blob/master/_assets/js/Slider.js

(function() {

	/**
	 * Simple slider control for EaselJS examples.
	 **/
	function Slider(min, max, width, height) {
		this.Shape_constructor();

	// public properties:
		this.min = this.value = min||0;
		this.max = max||100;

		this.width = width||100;
		this.height = height||20;

		this.values = {};

		this.trackColor = "#EEE";
		this.thumbColor = "#666";

		this.cursor = "pointer";
		this.on("mousedown", this._handleInput, this);
		this.on("pressmove", this._handleInput, this);
	}
	var p = createjs.extend(Slider, createjs.Shape);


// public methods:
	p.isVisible = function() { return true; };

	p.draw = function(ctx, ignoreCache) {
		if (this._checkChange()) {
			var x = (this.width-this.height) * Math.max(0,Math.min(1,(this.value-this.min) / (this.max-this.min)));
			this.graphics.clear()
				.beginFill(this.trackColor).drawRect(0,0,this.width,this.height)
				.beginFill(this.thumbColor).drawCircle(x,7,this.height-3);
				//.beginFill(this.thumbColor).drawRect(x,0,this.height, this.height);
		}
		this.Shape_draw(ctx, true);
	};


// private methods:
	p._checkChange = function() {
		var a = this, b = a.values;
		if (a.value !== b.value || a.min !== b.min || a.max !== b.max || a.width !== b.width || a.height !== b.height) {
			b.min = a.min;
			b.max = a.max;
			b.value = a.value;
			b.width = a.width;
			b.height = a.height;
			return true;
		}
		return false;
	};

	p._handleInput = function(evt) {
		var val = (evt.localX-this.height/2)/(this.width-this.height)*(this.max-this.min)+this.min;
		val = Math.max(this.min, Math.min(this.max, val));
		if (val == this.value) { return; }
		this.value = val;
		this.dispatchEvent("change");
	};


	window.Slider = createjs.promote(Slider, "Shape");
}());
