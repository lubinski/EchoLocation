using UnityEngine;
using System.Collections;

public class Button : MonoBehaviour {

	void OnTriggerEnter(Collider coll)
	{
		if (coll.gameObject.tag == "Player") {
			GameObject door = transform.parent.FindChild("door").gameObject;
			door.audio.Play();
			Destroy (door,2);
		}
	}
}
