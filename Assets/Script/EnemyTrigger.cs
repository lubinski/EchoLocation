using UnityEngine;
using System.Collections;

public class EnemyTrigger : MonoBehaviour {
	public GameObject monster;
	bool fired;
	void OnTriggerEnter(Collider coll)
	{
		if (fired) return;
		if (coll.gameObject.tag == "Player") {
			monster.SetActive(true);
			audio.Play ();
			fired = true;
		}
	}
}
