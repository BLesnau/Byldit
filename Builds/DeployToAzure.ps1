Param([switch]$vip)
$subscription = "Windows Azure MSDN - Visual Studio Ultimate"
$service = "byldit"
$package = "src\Byldit\BylditCloud\bin\Release\app.publish\BylditCloud.cspkg"
$configuration = "src\Byldit\BylditCloud\bin\Release\app.publish\ServiceConfiguration.Cloud.cscfg"
$timeStampFormat = "g"
$deploymentLabel = "Live Deploy $service v%build.number%"

Write-Output "Running Azure Imports"
Import-Module "C:\Program Files (x86)\Microsoft SDKs\Windows Azure\PowerShell\Azure\*.psd1"
Import-AzurePublishSettingsFile "C:\TeamCity\Azure.publishsettings"
Set-AzureSubscription -CurrentStorageAccount $service -SubscriptionName $subscription
 
function Publish(){
 if (!$vip) {
    $deployment = Get-AzureDeployment -ServiceName $service -Slot production -ErrorVariable a -ErrorAction silentlycontinue 

    if ($deployment.Name -ne $null) {
       #Update deployment inplace (usually faster, cheaper, won't destroy VIP)
       Write-Output "$(Get-Date -f $timeStampFormat) - Deployment exists in $service.  Upgrading deployment."
       UpgradeDeployment
    } else {
       Write-Output "$(Get-Date -f $timeStampFormat) - No deployment is detected. Creating a new deployment. "
       Write-Output "$(Get-Date -f $timeStampFormat) - Creating New Deployment: In progress"

       $opstat = New-AzureDeployment -Slot production -Package $package -Configuration $configuration -label $deploymentLabel -ServiceName $service 
    
       $waitedTime=0
       do {
          $ready=0
          $total=0

          # query the status of the running instances
          $list = (Get-AzureRole -ServiceName $service -Slot production -InstanceDetails).InstanceStatus 

          # count the number of ready instances
          $list | foreach-object { IF ($_ -eq "ReadyRole") { $ready++ } }

          # count the number in total
          $list | foreach-object { $total++ } 

          Write-Output "$ready out of $total instances are ready"

          # sleep for 10 seconds
          Start-Sleep -s 10
          $waitedTime = $waitedTime + 10
       }
       while (($ready -ne $total) -and ($waitedTime -lt 1000))

       $completeDeployment = Get-AzureDeployment -ServiceName $service -Slot production
       $completeDeploymentID = $completeDeployment.deploymentid
 
       Write-Output "$(Get-Date -f $timeStampFormat) - Creating New Deployment: Complete, Deployment ID: $completeDeploymentID"
    }
 } else {
    VipDeployment
 }
}
 
function VipDeployment()
{
    $deployment = Get-AzureDeployment -ServiceName $service -Slot staging -ErrorVariable a -ErrorAction silentlycontinue 
    
    if ($a[0] -eq $null) {
       Write-Output "$(Get-Date -f $timeStampFormat) - Deployment is detected. Deleting deployment. "
       Remove-AzureDeployment -Slot staging -ServiceName $service -Force
    } else {
       Write-Output "$(Get-Date -f $timeStampFormat) - No deployment is detected. Creating a new deployment. "
    }

    Write-Output "$(Get-Date -f $timeStampFormat) - Creating New Deployment: In progress"

    $opstat = New-AzureDeployment -Slot staging -Package $package -Configuration $configuration -label $deploymentLabel -ServiceName $service 
    
    $waitedTime=0
    do {
       $ready=0
       $total=0

       # query the status of the running instances
       $list = (Get-AzureRole -ServiceName $service -Slot staging -InstanceDetails).InstanceStatus 

       # count the number of ready instances
       $list | foreach-object { IF ($_ -eq "ReadyRole") { $ready++ } }

       # count the number in total
       $list | foreach-object { $total++ } 

       Write-Output "$ready out of $total instances are ready"

       # sleep for 10 seconds
       Start-Sleep -s 10
       $waitedTime = $waitedTime + 10
    }
    while (($ready -ne $total) -and ($waitedTime -lt 1000))

    $completeDeployment = Get-AzureDeployment -ServiceName $service -Slot staging
    $completeDeploymentID = $completeDeployment.deploymentid
 
    Write-Output "$(Get-Date -f $timeStampFormat) - Creating New Deployment: Complete, Deployment ID: $completeDeploymentID"
    Write-Output "$(Get-Date -f $timeStampFormat) - Swapping staging and production deployments"
    Get-AzureDeployment -ServiceName $service -Slot staging | Move-AzureDeployment
    
    Write-Output "$(Get-Date -f $timeStampFormat) - Removing staging deployment. "
    Remove-AzureDeployment -Slot staging -ServiceName $service -Force
}
 
function UpgradeDeployment()
{
    Write-Output "$(Get-Date -f $timeStampFormat) - Upgrading Deployment: In progress"
 
    # perform Update-Deployment
    $setdeployment = Set-AzureDeployment -Upgrade -Slot production -Package $package -Configuration $configuration -label $deploymentLabel -ServiceName $service -Force
 
    $completeDeployment = Get-AzureDeployment -ServiceName $service -Slot production
    $completeDeploymentID = $completeDeployment.deploymentid
 
    Write-Output "$(Get-Date -f $timeStampFormat) - Upgrading Deployment: Complete, Deployment ID: $completeDeploymentID"
}
 
Write-Output "Create Azure Deployment"
Publish