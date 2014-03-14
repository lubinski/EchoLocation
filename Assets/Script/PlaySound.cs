using UnityEngine;
using System.Collections;

public class PlaySound : MonoBehaviour {

	void OnTriggerEnter(Collider coll)
	{
		if (coll.gameObject.tag == "Player") {
			audio.Play();
			Destroy(gameObject, 5);
		}
	}
}
