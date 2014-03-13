using UnityEngine;
using System.Collections;

public class WallHit : MonoBehaviour {
	public GameObject bumpEmitter;

	void OnTriggerEnter(Collider coll)
	{
		print (1);
		if (coll.gameObject.tag == "Player") {
			print (2);
			GameObject bump = Instantiate (bumpEmitter) as GameObject;
			bump.transform.position = coll.ClosestPointOnBounds(transform.position);
			bump.audio.Play();
			Destroy (bump,5);
		}
	}
}
