module.exports = function(neume, _) {
  "use strict";

  var MAX_AUDIO_BUS_SIZE = neume.MAX_AUDIO_BUS_SIZE;

  neume.register("in", function(ugen, spec, inputs) {
    var context = ugen.$context;
    var outlet  = null;

    inputs = inputs.filter(_.isFinite).map(function(index) {
      return getAudioBus(context, index);
    });

    outlet = context.createSum(inputs);

    return new neume.Unit({
      outlet: outlet
    });
  });

  neume.register("out", function(ugen, spec, inputs) {
    var context = ugen.$context;
    var synth   = ugen.$synth;
    var outlet  = context.createSum(inputs);

    var index = _.clip(_.int(_.defaults(spec.bus, 0)), 0, MAX_AUDIO_BUS_SIZE);

    synth.$outputs[index] = outlet;

    return new neume.Unit({
      outlet: outlet,
      isOutput: true
    });
  });

  neume.register("local-in", function(ugen, spec, inputs) {
    var context = ugen.$context;
    var synth   = ugen.$synth;
    var outlet  = null;

    inputs = inputs.filter(_.isFinite).map(function(index) {
      return getLocalBus(context, synth, index);
    });

    outlet = context.createSum(inputs);

    return new neume.Unit({
      outlet: outlet
    });
  });

  neume.register("local-out", function(ugen, spec, inputs) {
    var context = ugen.$context;
    var synth   = ugen.$synth;
    var outlet  = null;

    var index = _.clip(_.int(_.defaults(spec.bus, 0)), 0, MAX_AUDIO_BUS_SIZE);
    var bus = getLocalBus(context, synth, index);

    outlet = context.createSum(inputs).connect(bus);

    return new neume.Unit({
      outlet: outlet
    });
  });

  function getAudioBus(context, index) {
    index = _.clip(_.int(_.defaults(index, 0)), 0, MAX_AUDIO_BUS_SIZE);

    return context.getAudioBus(index);
  }

  function getLocalBus(context, synth, index) {
    index = _.clip(_.int(_.defaults(index, 0)), 0, MAX_AUDIO_BUS_SIZE);

    if (!synth.$localBuses[index]) {
      synth.$localBuses[index] = context.createGain();
    }

    return synth.$localBuses[index];
  }
};