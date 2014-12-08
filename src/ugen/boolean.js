module.exports = function(neume, util) {
  "use strict";

  /**
   * $(boolean, {
   *   true: [number] = 1
   *   false: [number] = 0
   *   tC: [number] = 0
   * } ... inputs)
   *
   * methods:
   *   setValue(t, value)
   *   toggle(t)
   *
   * +--------+      +-------+
   * | inputs |  or  | DC(1) |
   * +--------+      +-------+
   *   ||||||
   * +------------------------------------+
   * | GainNode                           |
   * | - gain: value ? trueVal : falseVal |
   * +------------------------------------+
   *   |
   */
  neume.register("boolean", function(ugen, spec, inputs) {
    var context = ugen.$context;

    var data = !!spec.value;
    var trueVal = util.finite(util.defaults(spec.true, 1));
    var falseVal = util.finite(util.defaults(spec.false, 0));
    var param = new neume.Param(context, data ? trueVal : falseVal, spec);
    var outlet = inputs.length ? param.toAudioNode(inputs) : param;

    function update(t0, v0, v1, nextData) {
      param.update({ startValue: v0, endValue: v1, startTime: t0 });
      data = nextData;
    }

    return new neume.Unit({
      outlet: outlet,
      methods: {
        setValue: function(t, value) {
          if (typeof value === "boolean") {
            context.sched(util.finite(context.toSeconds(t)), function(t) {
              var v0 = data  ? trueVal : falseVal;
              var v1 = value ? trueVal : falseVal;
              update(t, v0, v1, value);
            });
          }
        },
        toggle: function(t) {
          context.sched(util.finite(context.toSeconds(t)), function(t) {
            var v0 = data ? trueVal : falseVal;
            var v1 = data ? falseVal : trueVal;
            update(t, v0, v1, !data);
          });
        }
      }
    });
  });

};
