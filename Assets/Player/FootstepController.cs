using UnityEngine;
using System.Collections;

public class FootstepController : MonoBehaviour {
	public float delay;
	// Update is called once per frame
	void Update () {
	
		if(Input.GetButton("Horizontal") || Input.GetButton("Vertical"))
		{
			if(!audio.isPlaying)
				audio.PlayDelayed(delay);
		}
	}
}
