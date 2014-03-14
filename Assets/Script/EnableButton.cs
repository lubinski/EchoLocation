using UnityEngine;
using System.Collections;

public class EnableButton : MonoBehaviour {
	public GameObject button;

	void OnTriggerEnter(Collider coll)
	{
		if (coll.gameObject.tag == "Player") {
			button.SetActive(true);
			button.audio.Play();
			Destroy(gameObject);
		}
	}
}
