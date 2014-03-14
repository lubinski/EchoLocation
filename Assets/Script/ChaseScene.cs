using UnityEngine;
using System.Collections;

public class ChaseScene : MonoBehaviour {
	public GameObject enemy;
	public GameObject startPosition;

	public AstarAI speed;

	void Start() {
		speed = enemy.GetComponent<AstarAI>();
	}


	void OnTriggerEnter(Collider coll)
	{
		if (coll.gameObject.tag == "Player") {
			enemy.transform.position = startPosition.transform.position;
			speed.speed = 75f;
			Destroy(gameObject);
		}
	}
}
