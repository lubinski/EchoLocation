using UnityEngine;
using System.Collections;

public class Ending : MonoBehaviour {
	
	void OnTriggerEnter(Collider coll)
	{
		if (coll.gameObject.tag == "Player") {
			audio.Play();
			//Destroy (ending,3);
			audio.pitch = 0.5f;
			//Debug.Log("collided");
			float wait = 0f;
			while (wait < 10f) {
				wait = Time.deltaTime + wait;
			}
			Application.Quit();
		}
	}
}
