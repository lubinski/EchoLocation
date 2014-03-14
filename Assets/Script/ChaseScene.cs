using UnityEngine;
using System.Collections;

public class ChaseScene : MonoBehaviour {
	public GameObject enemy;
	public GameObject startPosition;

	void OnTriggerEnter(Collider coll)
	{
		if (coll.gameObject.tag == "Player") {
			enemy.transform.position = startPosition.transform.position;
			Destroy(gameObject);
		}
	}
}
