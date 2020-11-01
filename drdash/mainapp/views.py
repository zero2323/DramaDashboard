import sys, requests, json, base64, time, binascii, string, json, rncryptor, MySQLdb, os, re
from django.shortcuts import render, redirect
from django.http import JsonResponse


# https://arab-drama.me/api/drdash
# https://arab-drama.me/api/drdashep?sid="showid"
def mainfunc(request):
    """ We use this function to check if show existe on db or no"""
    animes_list = []
    get_as_new_id = requests.get(f'https://arab-drama.me/api/drdash')
    as_new_id = (json.loads(get_as_new_id.content.decode()))
    for ix in as_new_id['Response']:
        anime_na = ix['drama_name']
        animes_list.append(anime_na)
    #return JsonResponse({"RES":animes_list})

    header = {'Client-Id': 'drama-android-app',
          'Client-Secret': '7befba6263cc14c90e2f1d6da2c5cf9b251bfbbd',
          'Accept': 'application/*+json',
          'Accept': 'application/vnd.drama-app-api.v1+json',
          'Connection': 'Keep-Alive',
          'Accept-Encoding': 'gzip',
          'User-Agent': 'okhttp/3.12.1'}

    req = requests.get("""https://drslayer.com/drama/public/drama-app-api/get-all-published-drama?json=%7B%22_offset%22%3A0%2C%22_limit%22%3A21%2C%22list_type%22%3A%22latest_updated_episode_new%22%7D&offset=0&list_type=latest_updated_episode_new&limit=40
                        """, headers=header)
    my_string = (json.loads(req.content.decode()))
    #return JsonResponse({"RES":str(req.text)})
    encrypted_data = my_string['result']
    #print (encrypted_data)
    password = b'9>E>VBa=X%;[5BX~=Q~K' #b'9>E>VBa=X%;[5BX~=Q~K'
    data = base64.b64decode(encrypted_data)
    decrypted_data = rncryptor.decrypt(data, password)
    movie_info = json.loads(decrypted_data)
    #return JsonResponse({"RES":movie_info})
    anime_lastest = []

    for i in movie_info:
        anime_name = i['drama_name']
        if anime_name not in animes_list:
            i['anime_status_in_db'] = 'NOT FOUND'
            anime_lastest.append(i)
        else:
            i['anime_status_in_db'] = 'FOUND'
            anime_lastest.append(i)
    return render(request, 'main.html', {'anime_lastest': anime_lastest})

def insert_new(request):
      header = {'Client-Id': 'drama-android-app',
          'Client-Secret': '7befba6263cc14c90e2f1d6da2c5cf9b251bfbbd',
          'Accept': 'application/*+json',
          'Accept': 'application/vnd.drama-app-api.v1+json',
          'Connection': 'Keep-Alive',
          'Accept-Encoding': 'gzip',
          'User-Agent': 'okhttp/3.12.1'}
      status = request.GET.get('status')
      drama_id = request.GET.get('id')
      if status == '0':
         insert_req = requests.get(f'https://drslayer.com/drama/public/drama-app-api/get-published-drama-info?drama_id={drama_id}', headers=header)
         #return JsonResponse({'data':(insert_req.text)})
         my_string = (json.loads(insert_req.content.decode()))
         #print (my_string)
         encrypted_data = my_string['result']
         password = b'9>E>VBa=X%;[5BX~=Q~K' 
         data = base64.b64decode(encrypted_data)
         decrypted_data = rncryptor.decrypt(data, password)
         drama_info = json.loads(decrypted_data)
         
         # Drama_Info
         drama_id = drama_info['drama_id']
         drama_name = drama_info['drama_name']
         drama_type = drama_info['drama_type']
         drama_status = drama_info['drama_status']
         drama_featured = drama_info['drama_featured']
         drama_published = drama_info['drama_published']
         drama_country = drama_info['drama_country']
         drama_release_date = drama_info['drama_release_date']
         drama_description = drama_info['drama_description']
         drama_cover_image = drama_info['drama_cover_image']
         drama_genres = drama_info['drama_genres']
         drama_genre_ids = drama_info['drama_genre_ids']
         drama_inserted_at = drama_info['drama_inserted_at']
         drama_updated_at = drama_info['drama_updated_at']
         drama_cover_image_url = drama_info['drama_cover_image_url']
         is_ol4 = None
         ol4_str = None
         ol4_patt = None
         my_list = [drama_id, drama_name, drama_type, drama_status, drama_featured, drama_published, drama_country, drama_release_date, drama_description, drama_cover_image, drama_genres, drama_genre_ids, drama_inserted_at, drama_updated_at, drama_cover_image_url, is_ol4, ol4_str, ol4_patt]
 
         drama_genres = f'{drama_country}, {drama_genres}'
         insert_query = (f"""INSERT INTO `a_shows`(`drama_id`, `drama_name`, `drama_score`, `drama_type`, `drama_status`, `drama_published`, `drama_featured`, `drama_country`, `drama_release_date`, `drama_description`, `drama_cover_image`, `drama_genre_ids`, `drama_genres`, `drama_updated_at`, `drama_inserted_at`, `drama_cover_image_url`, `is_ol4`, `ol4_str`, `ol4_patt`) VALUES ({drama_id},'{drama_name}',0,'{drama_type}','{drama_status}','{drama_published}','{drama_featured}','{drama_country}','{drama_release_date}','{drama_description}','{drama_cover_image}','{drama_genre_ids}','{drama_genres}','{drama_cover_image_url}','{drama_cover_image_url}','{drama_cover_image_url}', NULL, NULL, NULL);""")

         insert_query = insert_query.replace("'None'", "NULL")
         drama_info['insert_q'] = insert_query
         
         my_info_dict = {'drama_info': drama_info}

         return render(request, 'insert.html', my_info_dict)



def update(request):
    header = {'Client-Id': 'drama-android-app',
          'Client-Secret': '7befba6263cc14c90e2f1d6da2c5cf9b251bfbbd',
          'Accept': 'application/*+json',
          'Accept': 'application/vnd.drama-app-api.v1+json',
          'Connection': 'Keep-Alive',
          'Accept-Encoding': 'gzip',
          'User-Agent': 'okhttp/3.12.1'}

    drama_id = request.GET.get('id')
    drama_name = request.GET.get('name')

    get_as_new_id = requests.get(f'https://arab-drama.me/api/drdashep?sid={drama_id}')
    as_new_id = (json.loads(get_as_new_id.content.decode()))
    last_as_episode = as_new_id['Response']['episode_name']


    req_2 = requests.get(f'https://drslayer.com/drama/public/drama-app-api/get-published-drama-episodes?json={{"drama_id":"{drama_id}"}}')
    my_string_2 = (json.loads(req_2.content.decode()))
    encrypted_data_2 = my_string_2['result']
    password = b'9>E>VBa=X%;[5BX~=Q~K' 
    data_2 = base64.b64decode(encrypted_data_2)
    decrypted_data_2 = rncryptor.decrypt(data_2, password)
    drama_episodes = json.loads(decrypted_data_2)
    
    #return JsonResponse({"Response": len(drama_episodes['episodes'])})
    my_2 = []

    if len( drama_episodes['episodes']) > 5: 
        rate_limit = len( drama_episodes['episodes']) - 2
    else:
        rate_limit = 0
    
    ep_list = []
    for episode in drama_episodes['episodes'][rate_limit:]:
        my_dict = {}
        episode_id = episode['episode_id']
        episode_name = episode['episode_name']
        episode_number = episode['episode_number']
        episode_watched_history = episode['episode_watched_history']
        my_list_2 = [drama_id, drama_name, episode_id, episode_name, episode_number, episode_watched_history]

        
        my_2.append(my_list_2)
        insert_query_2 = f"""INSERT INTO `b_episodes`(`drama_id`, `drama_name`, `episode_id`, `episode_name`, `episode_number`, `episode_watched_history`) VALUES ({drama_id},"{drama_name}",{episode_id},"{episode_name}",{episode_number},"{episode_watched_history}");"""

        object_json = '{' + (f'"drama_id":{drama_id},"episode_id":"{episode_id}"') + '}'
        # Request Episode Streaming Links
        time.sleep(0.1)
        req_3 = requests.get(f'https://drslayer.com/drama/public/drama-app-api/get-published-drama-episodes?json={object_json}', headers=header)
        my_string_3 = (json.loads(req_3.content.decode()))
        encrypted_data_3 = my_string_3['result']
        password = b'9>E>VBa=X%;[5BX~=Q~K' 
        data_3 = base64.b64decode(encrypted_data_3)
        decrypted_data_3 = rncryptor.decrypt(data_3, password)
        stream_links = json.loads(decrypted_data_3)
        # Stream Links:
        stream_link = stream_links['episodes'][0]['episode_urls']
        for link in stream_link:
            if link['episode_server_name'] == 'CDN':
                mslayer = episode_id
                #print(mslayer)
            elif link['episode_server_name'] == 'multi':
                episode_url = link['episode_url']
                time.sleep(0.1)
                req_4 = requests.get(episode_url, headers=header)
                if req_4.text != 'not exist':
                    try:
                        multi_stream = (json.loads(req_4.content.decode()))
                        stream_url = "@@@".join(multi_stream)
                        episode_url = episode_url
                    except:
                        stream_url = ""
                        episode_url = ""
                else:
                    stream_url = ""
                    episode_url = ""
                #print(stream_url)
        insert_query_3 = f"""INSERT INTO `c_urls`(`G_id`, `drama_id`, `drama_name`, `episode_id`, `episode_name`, `episode_number`, `episode_url`, `stream_url`, `mslayer`, `backup`) VALUES (NULL,{drama_id},'{drama_name}',{episode_id},'{episode_name}','{episode_number}','{episode_url}','{stream_url}','{mslayer}',NULL);"""
        insert_query_2 = insert_query_2.replace('\\','')
        insert_query_3 = insert_query_3.replace('\\','')
        my_dict[episode_name] = f"{insert_query_2} {insert_query_3} "
        ep_list.append(my_dict)
        response_list = ep_list
    return render(request, 'update.html', {'response_list':ep_list, 'last_add': last_as_episode})