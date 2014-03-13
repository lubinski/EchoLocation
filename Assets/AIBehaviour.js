#pragma strict
@script RequireComponent(Rigidbody)

var target : Transform;	// The Player
var moveSpeed : float = 6.0;
var turnSpeed : float = 2.0;
var isGrounded : boolean = false;
var isChasing : boolean = true;
var rayDistance : float = 5.0;
var minimumRange : float = 10.0;
var maximumRange : float = 40.0;

var freeRoamTimer : float = 0.0;
var freeRoamTimerMax : float = 5.0;
var freeRoamTimerMaxRange : float = 1.5;
var freeRoamTimerMaxAdjusted : float = 5.0;

var calcDir : Vector3;

var isSlender : boolean = true;
var isVisible : boolean = false;
var offScreenDot : float = 0.8;

//var playerHealthScript : PlayerHealth;

private var myTransform : Transform;
private var myRigidBody : Rigidbody;
private var desiredVelocity : Vector3;
private var minimumRangeSqr : float;
private var maximumRangeSqr : float;
private var reduceDistanceAmount : float;
private var increaseSpeedAmount : float = 0.5;

enum NPC {
	Idle,
	FreeRoam,
	Chasing,
	RunningAway
}
var myState : NPC = NPC.Idle;

function Start () {
	// Faster performance to not use a function to find squared value
	minimumRangeSqr = minimumRange * minimumRange;
	maximumRangeSqr = maximumRange * maximumRange;

	reduceDistanceAmount = (maximumRange - 4.0) / 7.0;

	myTransform = transform;
	myRigidBody = rigidbody;
	
	// Keeps the game object upright
	myRigidBody.freezeRotation = true;
	
	calcDir = Random.onUnitSphere;
	calcDir.y = 0.0; //myTransform.forward.y;
	
	if(isSlender) {
		InvokeRepeating("TeleportEnemy", 60.0, 20.0);
		
		var targetObject : GameObject = GameObject.Find("Player");
		
		if(targetObject) {
			target = targetObject.transform;
		//	playerHealthScript = target.GetComponent(PlayerHealth);
		}
		else {
			Debug.Log("No object named Player found");
		}
	}
}

function Update () {
	if(isSlender) {
		SlenderDecisions();
	}
	else {
		DefaultDecisions();
	}

	switch(myState) {
		case NPC.Idle:
			myTransform.LookAt(target);
			desiredVelocity = new Vector3(0, myRigidBody.velocity.y, 0);
			break;
		case NPC.FreeRoam:
			freeRoamTimer += Time.deltaTime;
			if(freeRoamTimer > freeRoamTimerMaxAdjusted) {
				freeRoamTimer = 0.0;
				freeRoamTimerMaxAdjusted = freeRoamTimerMax + Random.Range(-freeRoamTimerMaxRange, freeRoamTimerMaxRange);
				calcDir = Random.onUnitSphere;
				calcDir.y = 0.0; //myTransform.forward.y;
			}
			Moving(calcDir);
			break;
		case NPC.Chasing:
			Moving((target.position - myTransform.position).normalized);
			break;
		case NPC.RunningAway:
			Moving((myTransform.position - target.position).normalized);
			break;
		default:
			break;
	}
}

// Moves the gameObject forward
function FixedUpdate() {
	if(isGrounded)
		myRigidBody.velocity = desiredVelocity;
}

// The NPC gets closer to the PC and moves faster
function ReduceDistance() {
	minimumRange -= reduceDistanceAmount;
	minimumRangeSqr = minimumRange * minimumRange;

	moveSpeed += increaseSpeedAmount;
}

// If the NPC is too far away, teleport closer to the PC
function TeleportEnemy() {
	CheckIfVisible();
	
	if(!isVisible) {
		var sqrDist : float = (target.position - myTransform.position).sqrMagnitude;
		
		if(sqrDist > maximumRangeSqr + 25.0) {
			var teleportDistance : float = maximumRange + 15.0;
			
			var randomDir : int = Random.Range(0, 2);
			if(randomDir == 0)
				randomDir = -1;
			
			// Pick position to the right or left of the target
			var terrainPosCheck : Vector3 = target.position + (randomDir * target.right * teleportDistance );
			terrainPosCheck.y = 5000.0;
			var hit : RaycastHit;

			// Shoot rays downward, may break with trees?
			if(Physics.Raycast(terrainPosCheck, -Vector3.up, hit, Mathf.Infinity)) {
				//Debug.Log("HITTING: " + hit.collider.gameObject.name);
				if(hit.collider.gameObject.name == "Terrain") {
					// We found a place on the map
					myTransform.position = hit.point + new Vector3(0, 0.25, 0); // Enough clearance to be off the ground
				}
			}
		}
	}
}

function SlenderDecisions() {
	CheckIfVisible();
	var sqrDist : float = (target.position - myTransform.position).sqrMagnitude;
			
	if(isVisible) {
		// Chase if too far away from target
		if(sqrDist > maximumRangeSqr) {
			myState = NPC.Chasing;
		//	playerHealthScript.UpdateHealth(true);
		}
		else {
			var hit : RaycastHit;
			
			Debug.DrawLine(myTransform.position, target.position, Color.green);
			
			// If seen, stay still
			if(Physics.Linecast(myTransform.position, target.position, hit)) {
				if(hit.collider.gameObject.name == target.name) {
					myState = NPC.Idle;
					// Decrease the health of the player
			//		playerHealthScript.UpdateHealth(false);					
				}
				else {
					myState = NPC.Chasing;
			//		playerHealthScript.UpdateHealth(true);

				}
			
			}
		}
	}
	// Not Visible
	else {
	//	playerHealthScript.UpdateHealth(true);
		// Chase if too far away from target
		if(sqrDist > minimumRangeSqr) {
			myState = NPC.Chasing;
		}
		// If too close stay still
		else {
			myState = NPC.Idle;
		}
	}
}

// Checks if game object is within the target's view
function CheckIfVisible() {
	var fwd : Vector3 = target.forward;
	var other : Vector3 = (myTransform.position - target.position).normalized;

	var dotProduct : float = Vector3.Dot(fwd, other);
	
	isVisible = false;
	
	if(dotProduct > offScreenDot) {
		isVisible = true;
	}
}

function DefaultDecisions() {
	var sqrDist : float = (target.position - myTransform.position).sqrMagnitude;

	if(sqrDist > maximumRangeSqr) {
		if(isChasing) {
			myState = NPC.Chasing;
		} 
		else {
			myState = NPC.FreeRoam;
		}
	}
	else if(sqrDist < minimumRangeSqr) {
		if(isChasing) {
			myState = NPC.Idle;
		}
		else {
			myState = NPC.RunningAway;
		}
	}
	else {
		if(isChasing) {
			myState = NPC.Chasing;
		}
		else {
			myState = NPC.RunningAway;
		}
	}
}

function Moving(lookDir : Vector3) {
	// Rotation
	//var lookDir : Vector3 = (target.position - myTransform.position).normalized;
	
	var hit : RaycastHit;
	
	var shoulderMultiplier : float = 0.75;
	var leftRayPos : Vector3 = myTransform.position - (shoulderMultiplier * myTransform.right);
	var rightRayPos : Vector3 = myTransform.position + (shoulderMultiplier * myTransform.right);

	if(Physics.Raycast(rightRayPos, myTransform.forward, hit, rayDistance)) {
		if(hit.collider.gameObject.name != "Terrain") {
			Debug.DrawLine(rightRayPos, hit.point, Color.red);
			lookDir += hit.normal * 20.0;
		}
	} 
	if(Physics.Raycast(leftRayPos, myTransform.forward, hit, rayDistance)) {
		if(hit.collider.gameObject.name != "Terrain") {
			Debug.DrawLine(leftRayPos, hit.point, Color.red);
			lookDir += hit.normal * 20.0;
		}
	}
	else {
		Debug.DrawRay(leftRayPos, myTransform.forward * rayDistance, Color.yellow);
		Debug.DrawRay(rightRayPos, myTransform.forward * rayDistance, Color.yellow);
	}
	
	//Debug.Log("velocity = " + myRigidBody.velocity + " : vel mag = " + myRigidBody.velocity.magnitude); 
	// If myRigidBody.velocity.sqrMagnitude < 1.75 then the NPC is stuck
	
	//Move the NPC to the right, to get it from being stuck
	if(myRigidBody.velocity.sqrMagnitude < 1.75) {
		lookDir += myTransform.right * 20.0;
	}
	var lookRot : Quaternion = Quaternion.LookRotation(lookDir);
	
	// Smoothly rotate the game object
	myTransform.rotation = Quaternion.Slerp(myTransform.rotation, lookRot, turnSpeed * Time.deltaTime);
	
	desiredVelocity = myTransform.forward * moveSpeed;
	desiredVelocity.y = myRigidBody.velocity.y;
}

// Determines if the NPC is grounded or not
function OnCollisionEnter(collision : Collision) {
	if(collision.collider.gameObject.name == "Floor" || collision.collider.gameObject.name == "Terrain")
		isGrounded = true;
}

function OnCollisionStay(collision : Collision) {
	if(collision.collider.gameObject.name == "Floor" || collision.collider.gameObject.name == "Terrain")
		isGrounded = true;	
}

function OnCollisionExit(collision : Collision) {
	if(collision.collider.gameObject.name == "Floor" || collision.collider.gameObject.name == "Terrain")
		isGrounded = false;
}