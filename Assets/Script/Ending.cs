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
			Invoke("EndGame", 10);
		}
	}

	void EndGame() {
		Application.Quit();
		Debug.Log("QUIT");
	}
}
