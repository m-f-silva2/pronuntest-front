class RandomNoiseProcessor extends AudioWorkletProcessor {
	process(inputs, outputs, parameters) {
	  const output = outputs[0];
	  output.forEach((channel) => {
		/* console.log('>> >>	xxx:', inputs, outputs, parameters); */
		for (let i = 0; i < channel.length; i++) {
		  //channel[i] = Math.random() * 2 - 1;
		}
	  });
	  return true;
	}
  }
  
  registerProcessor("random-noise-processor", RandomNoiseProcessor);