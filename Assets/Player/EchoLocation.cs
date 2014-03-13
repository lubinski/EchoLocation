using UnityEngine;
using System.Collections;

public class EchoLocation : MonoBehaviour {
	public int range;

	// Update is called once per frame
	void Update () {
		if(Input.GetButtonDown("Interact")){
			Ray ray = Camera.main.ScreenPointToRay (Input.mousePosition);
    		RaycastHit hit = new RaycastHit();
    		if (Physics.Raycast (ray, out hit, range)) {
    	    	Debug.DrawLine (ray.origin, hit.point,Color.red,5f);
				//use a child object to play click sound for consistency.
				transform.FindChild("ClickEmitter").audio.Play();
    		}
		}
	}
}
