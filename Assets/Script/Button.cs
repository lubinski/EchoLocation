using UnityEngine;
using System.Collections;

public class Button : MonoBehaviour {

	public GameObject door;

	void OnTriggerEnter(Collider coll)
	{
		if (coll.gameObject.tag == "Player") {
			if(door) {
				door.audio.Play();
				Destroy (door,2);
			}
			audio.pitch = 0.5f;
		}
	}
}
